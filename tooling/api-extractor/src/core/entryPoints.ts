import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { toAbsolute, toRelative } from '../_shared/path';
import type { ApiDiagnostic, ExtractProjectOptions } from '../interfaces';

export interface CollectedEntryPoints {
    cwd: string;
    diagnostics: ApiDiagnostic[];
    entryPoints: string[];
    existingEntryPoints: string[];
}

export const readPackageName = (cwd: string) => {
    const packageJsonPath = join(cwd, 'package.json');

    if (!existsSync(packageJsonPath)) return undefined;

    try {
        return JSON.parse(readFileSync(packageJsonPath, 'utf-8')).name as string | undefined;
    } catch {
        return undefined;
    }
};

export const collectEntryPoints = (options: ExtractProjectOptions): CollectedEntryPoints => {
    const cwd = options.cwd ?? process.cwd();
    const diagnostics: ApiDiagnostic[] = [];
    const entryPoints = options.entryPoints.map(entryPoint => toAbsolute(cwd, entryPoint));
    const existingEntryPoints = entryPoints.filter(entryPoint => {
        if (existsSync(entryPoint)) return true;

        const severity = options.diagnostics?.missingEntryPoint ?? 'error';

        if (severity !== 'ignore') {
            diagnostics.push({
                code: 'missing-entry-point',
                message: `Entry point does not exist: ${toRelative(cwd, entryPoint)}`,
                severity,
                source: {
                    fileName: toRelative(cwd, entryPoint),
                },
            });
        }

        return false;
    });

    return {
        cwd,
        diagnostics,
        entryPoints,
        existingEntryPoints,
    };
};
