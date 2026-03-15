/* eslint-disable no-console */
import {
    cpSync,
    existsSync,
    lstatSync,
    mkdirSync,
    realpathSync,
    readFileSync,
    readdirSync,
    rmSync,
    statSync,
    symlinkSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const VALID_MODES = new Set(['copy', 'link']);
const CONFIG_PATH = path.resolve(process.cwd(), 'skills/config.json');
const SKILLS_DIR = path.resolve(process.cwd(), 'skills');

function expandHome(inputPath) {
    if (!inputPath) {
        return '';
    }
    if (inputPath === '~') {
        return os.homedir();
    }
    if (inputPath.startsWith('~/') || inputPath.startsWith('~\\')) {
        return path.join(os.homedir(), inputPath.slice(2));
    }

    return inputPath;
}

function getPathInfo(targetPath) {
    try {
        const lst = lstatSync(targetPath);
        const symlinked = lst.isSymbolicLink();
        let directoryLike = lst.isDirectory();

        if (symlinked) {
            try {
                directoryLike = statSync(targetPath).isDirectory();
            } catch {
                directoryLike = false;
            }
        }

        return {
            exists: true,
            directoryLike,
            symlinked,
        };
    } catch {
        return {
            exists: false,
            directoryLike: false,
            symlinked: false,
        };
    }
}

function discoverSkills(skillsDir) {
    const skillsDirInfo = getPathInfo(skillsDir);
    if (!skillsDirInfo.exists || !skillsDirInfo.directoryLike) {
        throw new Error(`Skills directory not found or not a directory: ${skillsDir}`);
    }

    const skillRecords = [];
    const entries = readdirSync(skillsDir, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.name.startsWith('.')) {
            continue;
        }
        if (!entry.isDirectory()) {
            continue;
        }

        const skillPath = path.join(skillsDir, entry.name);
        const skillMd = path.join(skillPath, 'SKILL.md');
        if (!existsSync(skillMd)) {
            continue;
        }

        skillRecords.push({
            name: entry.name,
            sourcePath: path.resolve(skillPath),
        });
    }

    skillRecords.sort((a, b) => a.name.localeCompare(b.name));

    return skillRecords;
}

function loadRawAgents(configPath) {
    if (!existsSync(configPath)) {
        console.log(`[info] Config not found, skip install: ${configPath}`);

        return [];
    }

    let parsed;
    try {
        parsed = JSON.parse(readFileSync(configPath, 'utf8'));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid JSON in ${configPath}: ${message}`);
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error(`Config must be a JSON object: ${configPath}`);
    }
    if (!Object.prototype.hasOwnProperty.call(parsed, 'agents')) {
        throw new Error(`Config is missing required field "agents": ${configPath}`);
    }
    if (!Array.isArray(parsed.agents)) {
        throw new Error(`Config field "agents" must be an array: ${configPath}`);
    }

    return parsed.agents;
}

function resolveDestinationPath(rawDestination, configDir) {
    const expanded = expandHome(rawDestination);
    if (path.isAbsolute(expanded)) {
        return path.resolve(expanded);
    }

    return path.resolve(configDir, expanded);
}

function normalizeAgents(rawAgents, configDir) {
    const normalizedAgents = [];
    const errors = [];
    const seenNames = new Set();

    for (let index = 0; index < rawAgents.length; index++) {
        const rawAgent = rawAgents[index];
        const fallbackName = `agent-${index + 1}`;

        if (!rawAgent || typeof rawAgent !== 'object' || Array.isArray(rawAgent)) {
            errors.push(`[skip] [${fallbackName}] invalid agent config object`);
            continue;
        }

        const rawName = typeof rawAgent.name === 'string' ? rawAgent.name.trim() : '';
        const name = rawName || fallbackName;
        const normalizedName = name.toLowerCase();

        if (seenNames.has(normalizedName)) {
            errors.push(`[skip] [${name}] duplicate agent name`);
            continue;
        }
        seenNames.add(normalizedName);

        const rawDestination = typeof rawAgent.destination === 'string' ? rawAgent.destination.trim() : '';
        if (!rawDestination) {
            errors.push(`[skip] [${name}] destination is not configured`);
            continue;
        }

        const modeCandidate = typeof rawAgent.mode === 'string' ? rawAgent.mode.trim().toLowerCase() : 'copy';
        if (!VALID_MODES.has(modeCandidate)) {
            errors.push(`[skip] [${name}] invalid mode "${modeCandidate}" (allowed: copy, link)`);
            continue;
        }

        const createIfMissingCandidate = rawAgent.createIfMissing;
        if (createIfMissingCandidate !== undefined && typeof createIfMissingCandidate !== 'boolean') {
            errors.push(`[skip] [${name}] "createIfMissing" must be boolean when provided`);
            continue;
        }

        const destination = resolveDestinationPath(rawDestination, configDir);
        normalizedAgents.push({
            name,
            mode: modeCandidate,
            destination,
            createIfMissing: createIfMissingCandidate === true,
        });
    }

    return { normalizedAgents, errors };
}

function installSkill(sourceSkillPath, targetSkillPath, mode) {
    const sourceResolved = path.resolve(sourceSkillPath);
    const targetResolved = path.resolve(targetSkillPath);

    if (sourceResolved === targetResolved) {
        throw new Error('target path is the same as source path, abort to avoid data loss');
    }

    if (existsSync(targetResolved)) {
        if (mode === 'link') {
            try {
                const targetLst = lstatSync(targetResolved);
                if (targetLst.isSymbolicLink()) {
                    const targetReal = realpathSync(targetResolved);
                    const sourceReal = realpathSync(sourceResolved);
                    if (targetReal === sourceReal) {
                        return 'unchanged';
                    }
                }
            } catch {
                // Fall through and reinstall.
            }
        }
        rmSync(targetResolved, { recursive: true, force: true });
    }

    if (mode === 'copy') {
        cpSync(sourceResolved, targetResolved, { recursive: true });

        return 'installed';
    }

    const linkType = process.platform === 'win32' ? 'junction' : 'dir';
    symlinkSync(sourceResolved, targetResolved, linkType);

    return 'installed';
}

function run() {
    const skills = discoverSkills(SKILLS_DIR);
    if (!skills.length) {
        console.log(`[info] No skill folders found under ${SKILLS_DIR}`);

        return;
    }

    const rawAgents = loadRawAgents(CONFIG_PATH);
    if (!rawAgents.length) {
        console.log('[info] No agents configured, nothing to install.');

        return;
    }

    const configDir = path.dirname(CONFIG_PATH);
    const { normalizedAgents, errors } = normalizeAgents(rawAgents, configDir);
    for (const message of errors) {
        console.log(message);
    }

    if (!normalizedAgents.length) {
        console.log(`[summary] installed: 0, skipped: ${errors.length}, failed: 0`);
        console.log('[info] No valid agents after validation.');

        return;
    }

    let installedCount = 0;
    let skippedCount = errors.length;
    let failedCount = 0;
    let codexInstalled = false;

    for (const agent of normalizedAgents) {
        let destinationInfo = getPathInfo(agent.destination);
        if (!destinationInfo.exists) {
            if (agent.createIfMissing) {
                try {
                    mkdirSync(agent.destination, { recursive: true });
                    destinationInfo = getPathInfo(agent.destination);
                    if (!destinationInfo.exists || !destinationInfo.directoryLike) {
                        failedCount += 1;
                        console.log(
                            `[fail] [${agent.name}] unable to create destination as directory: ${agent.destination}`,
                        );
                        continue;
                    }
                    console.log(`[info] [${agent.name}] destination created: ${agent.destination}`);
                } catch (error) {
                    failedCount += 1;
                    const message = error instanceof Error ? error.message : String(error);
                    console.log(`[fail] [${agent.name}] unable to create destination: ${message}`);
                    continue;
                }
            } else {
                skippedCount += 1;
                console.log(
                    `[skip] [${agent.name}] destination not detected: ${agent.destination} (set createIfMissing=true to auto-create)`,
                );
                continue;
            }
        }
        if (!destinationInfo.directoryLike) {
            skippedCount += 1;
            console.log(`[skip] [${agent.name}] destination is not a directory: ${agent.destination}`);
            continue;
        }

        let installedAnyForAgent = false;

        for (const skill of skills) {
            const targetSkillPath = path.join(agent.destination, skill.name);
            try {
                const result = installSkill(skill.sourcePath, targetSkillPath, agent.mode);
                if (result === 'unchanged') {
                    skippedCount += 1;
                    console.log(`[skip] [${agent.name}] ${skill.name} already linked: ${targetSkillPath}`);
                } else {
                    installedCount += 1;
                    installedAnyForAgent = true;
                    console.log(`[install] [${agent.name}] ${skill.name} -> ${targetSkillPath} (${agent.mode})`);
                }
            } catch (error) {
                failedCount += 1;
                const message = error instanceof Error ? error.message : String(error);
                console.log(`[fail] [${agent.name}] ${skill.name} -> ${targetSkillPath} (${message})`);
            }
        }

        if (installedAnyForAgent && agent.name.toLowerCase() === 'codex') {
            codexInstalled = true;
        }
    }

    console.log(`\n[summary] installed: ${installedCount}, skipped: ${skippedCount}, failed: ${failedCount}`);

    if (codexInstalled) {
        console.log('[info] Restart Codex to pick up newly installed skills.');
    }
}

try {
    run();
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`skills:install failed: ${message}`);
    process.exit(1);
}
