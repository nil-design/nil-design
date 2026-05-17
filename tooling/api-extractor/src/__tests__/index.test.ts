import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { extractProject } from '../index';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(__dirname, 'fixtures/basic');
const entryPoint = resolve(fixtureDir, 'index.tsx');
const reExportEntryPoint = resolve(fixtureDir, 're-export.ts');
const unknownEntryPoint = resolve(fixtureDir, 'unknown.ts');
const tsconfig = resolve(fixtureDir, 'tsconfig.json');

describe('@nild/api-extractor', () => {
    it('extracts React components, compounds, hooks and generic TypeScript exports', async () => {
        const project = await extractProject({
            cwd: fixtureDir,
            entryPoints: [entryPoint],
            tsconfig,
            exclude: [],
        });
        const button = project.items.find(item => item.name === 'Button');
        const hook = project.items.find(item => item.name === 'usePrevious');
        const sum = project.items.find(item => item.name === 'sum');
        const direction = project.items.find(item => item.name === 'Direction');
        const tupleValue = project.items.find(item => item.name === 'TupleValue');
        const store = project.items.find(item => item.name === 'Store');
        const renamedUtility = project.items.find(item => item.name === 'renamedUtility');

        expect(project.schemaVersion).toBe('1.0');
        expect(project.diagnostics).toEqual([]);
        expect(project.items.map(item => [item.name, item.kind])).toContainEqual(['Button', 'component']);
        expect(button?.kind).toBe('component');
        expect(button && button.kind === 'component' ? button.react.pattern : undefined).toBe('forwardRef');
        expect(button && button.kind === 'component' ? button.compounds.map(item => item.name) : []).toEqual([
            'Button.Group',
        ]);
        expect(
            button && button.kind === 'component'
                ? button.compounds[0].propsObject?.properties.map(prop => prop.name)
                : [],
        ).toEqual(['children']);
        expect(button && button.kind === 'component' ? button.propsObject?.kind : undefined).toBe('object');
        expect(button && button.kind === 'component' ? button.refType?.text : undefined).toBe('HTMLButtonElement');
        expect(button).not.toHaveProperty('tags');
        expect(hook?.kind).toBe('hook');
        expect(hook && hook.kind === 'hook' ? hook.callSignatures[0].parameters[0].name : undefined).toBe('value');
        expect(sum?.kind).toBe('function');
        expect(direction?.kind).toBe('enum');
        expect(tupleValue?.kind).toBe('typeAlias');
        expect(store?.kind).toBe('class');
        expect(renamedUtility?.kind).toBe('function');
    });

    it('supports filters and transforms', async () => {
        const project = await extractProject({
            cwd: fixtureDir,
            entryPoints: [entryPoint],
            tsconfig,
            exclude: [],
            filters: {
                includeKinds: ['function', 'hook'],
            },
            transforms: [
                item => ({
                    ...item,
                    name: `api:${item.name}`,
                }),
                item => (item.name === 'api:sum' ? undefined : item),
            ],
        });

        expect(project.items.every(item => ['function', 'hook'].includes(item.kind))).toBe(true);
        expect(project.items.every(item => item.name.startsWith('api:'))).toBe(true);
        expect(project.items.map(item => item.name)).not.toContain('api:sum');
    });

    it('reports missing entry points without throwing', async () => {
        const project = await extractProject({
            cwd: fixtureDir,
            entryPoints: ['missing.ts'],
            tsconfig,
        });

        expect(project.items).toEqual([]);
        expect(project.diagnostics).toMatchObject([
            {
                code: 'missing-entry-point',
                severity: 'error',
            },
        ]);
    });

    it('supports comment options', async () => {
        const project = await extractProject({
            cwd: fixtureDir,
            entryPoints: [entryPoint],
            tsconfig,
            exclude: [],
            comments: {
                includeSummary: false,
                includeModifierTags: false,
            },
        });
        const buttonProps = project.items.find(item => item.name === 'ButtonProps');
        const variant =
            buttonProps && buttonProps.kind === 'interface'
                ? buttonProps.properties.find(property => property.name === 'variant')
                : undefined;

        expect(variant?.comment?.summary).toBe('');
        expect(variant?.comment?.modifierTags).toEqual([]);
        expect(variant?.comment?.blockTags[0]).toMatchObject({
            tag: '@defaultValue',
        });
        expect(variant?.comment?.blockTags[0].text).toContain("'solid'");
    });

    it('reports unknown exports when diagnostics request it', async () => {
        const project = await extractProject({
            cwd: fixtureDir,
            entryPoints: [unknownEntryPoint],
            tsconfig,
            exclude: [],
        });

        expect(project.diagnostics).toContainEqual(
            expect.objectContaining({
                code: 'unknown-export',
                severity: 'warning',
            }),
        );
    });

    it('supports custom hook classifiers', async () => {
        const project = await extractProject({
            cwd: fixtureDir,
            entryPoints: [entryPoint],
            tsconfig,
            exclude: [],
            diagnostics: {
                unknownExport: 'ignore',
            },
            reactComponents: {
                customHookClassifiers: [context => context.item.name.endsWith('HookFactory')],
            },
        });

        expect(project.items.find(item => item.name === 'createHookFactory')?.kind).toBe('hook');
    });

    it('exposes formatted type text on the stable schema', async () => {
        const project = await extractProject({
            cwd: fixtureDir,
            entryPoints: [entryPoint],
            tsconfig,
            exclude: [],
        });
        const version = project.items.find(item => item.name === 'version');

        expect(version?.kind).toBe('constant');
        expect(version && version.kind === 'constant' ? version.type.text : undefined).toBe("'1.0.0'");
    });

    it('keeps entry point ownership precise across multiple entry points', async () => {
        const project = await extractProject({
            cwd: fixtureDir,
            entryPoints: [entryPoint, reExportEntryPoint],
            tsconfig,
            exclude: [],
            diagnostics: {
                unknownExport: 'ignore',
            },
        });
        const renamedUtility = project.items.find(item => item.name === 'renamedUtility');
        const aliasedUtility = project.items.find(item => item.name === 'aliasedUtility');

        expect(renamedUtility?.entryPoint).toBe('index.tsx');
        expect(aliasedUtility?.entryPoint).toBe('re-export.ts');
    });
});
