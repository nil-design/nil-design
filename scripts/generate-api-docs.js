import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Application, TSConfigReader, TypeDocReader, ReflectionKind } from 'typedoc';

const { join } = posix;
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');
const componentsDir = join(rootDir, 'packages/components/src');
const docsDir = join(rootDir, 'docs/zh-CN/components');

/**
 * @param {string} str
 * @returns {string}
 */
const kebabToPascal = str => {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
};

/**
 * @param {import('typedoc').DeclarationReflection} reflection
 * @returns {string}
 */
const generateMarkdownTable = reflection => {
    const headers = ['属性名', '描述', '类型', '默认值'];
    const data = (reflection.children || []).map(prop => {
        const type =
            prop.type?.type === 'union'
                ? prop.type?.types.map(t => t.qualifiedName ?? t.name).join(' \\| ')
                : (prop.type?.qualifiedName ?? prop.type?.name ?? '-');
        const defaultValue = prop.defaultValue ?? '-';
        const description = prop.comment?.shortText ?? '-';

        return {
            name: prop.name,
            description,
            type,
            defaultValue,
        };
    });
    const normalize = v => (v === '-' ? v : `\`${v}\``);
    const rows = data.map(row => [row.name, row.description, normalize(row.type), normalize(row.defaultValue)]);

    return [headers, headers.map(() => '---'), ...rows].map(row => `| ${row.join(' | ')} |`).join('\n');
};

async function generateDocs() {
    const components = readdirSync(componentsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const component of components) {
        const componentDir = join(componentsDir, component);
        const outputPath = join(docsDir, component, `api.md`);
        const componentName = kebabToPascal(component);
        const entryPoint = join(componentDir, 'index.ts');

        if (!existsSync(entryPoint)) {
            console.warn(`[${componentName}]: no entry point found.`);
            continue;
        }

        const app = await Application.bootstrap({
            entryPoints: [entryPoint],
            exclude: ['**/*.test.tsx', '**/__tests__/**'],
            json: true,
            tsconfig: join(rootDir, 'tsconfig.json'),
            skipErrorChecking: true,
            excludePrivate: true,
            excludeProtected: true,
            excludeExternals: true,
        });

        app.options.addReader(new TypeDocReader());
        app.options.addReader(new TSConfigReader());

        const project = await app.convert();

        if (!project) {
            throw new Error(`[${componentName}]: failed to convert project.`);
        }

        if (!project.children || project.children.length === 0) {
            console.warn(`[${componentName}]: no interface found.`);
            continue;
        }

        const reflection =
            project.children.find(
                child => child.name === `${componentName}Props` && child.kind === ReflectionKind.Interface,
            ) ??
            project.children.find(
                child =>
                    child.escapedName === componentName &&
                    child.kind === ReflectionKind.Variable &&
                    child.type.qualifiedName === 'React.FC',
            );

        if (reflection) {
            writeFileSync(outputPath, generateMarkdownTable(reflection));
            console.log(`[${componentName}]: generated successfully.`);
        } else {
            console.warn(`[${componentName}]: no interface found.`);
        }
    }
}

generateDocs().catch(error => {
    console.error('Error generating:', error);
    process.exit(1);
});
