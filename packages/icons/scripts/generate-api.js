/* eslint-disable no-console */
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import locales from '../../../scripts/locales/index.js';
import {
    getProjectReflection,
    getAffiliatedComponentReflections,
    getPropsTypeAndRefType,
    getMarkdownTable,
    getRootDir,
    serializeComment,
    serializeDeclarationReflection,
} from '../../../scripts/shared/index.js';

const { join } = posix;
const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\\/g, '/');
const srcDir = join(__dirname, '../src');
const tsconfigPath = join(__dirname, '../tsconfig.json');

(async () => {
    const entryPoint = join(srcDir, 'index.ts');

    if (!existsSync(entryPoint)) return;

    console.log(`[${relative(getRootDir(), srcDir)}]:`);

    const projectReflection = await getProjectReflection({
        entryPoints: [entryPoint],
        tsconfig: tsconfigPath,
    });

    /** @type {Array<{ name: string, propsDeclaration: ReturnType<typeof serializeDeclarationReflection>, refDeclaration: ReturnType<typeof serializeDeclarationReflection> }>} */
    const targets = [];

    for (const reflection of projectReflection.children) {
        if (!reflection.comment) continue;

        const { tags } = serializeComment(reflection);
        const categoryTag = tags['@category'];

        if (!categoryTag || categoryTag.text !== 'Components') continue;
        if (!reflection.type) continue;

        [reflection, ...getAffiliatedComponentReflections(reflection)].forEach(componentReflection => {
            const { escapedName } = componentReflection;
            const [propsType, refType] = getPropsTypeAndRefType(componentReflection);

            targets.push({
                name: escapedName,
                propsDeclaration: serializeDeclarationReflection(propsType?.reflection),
                refDeclaration: serializeDeclarationReflection(refType?.reflection),
            });
        });
    }

    if (targets.length === 0) {
        console.log(`there is nothing to output`);

        return;
    }

    for (const locale of ['zh-CN']) {
        const i18n = locales[locale];
        const outputPath = join(srcDir, `API.${locale}.md`);
        const content = [];

        targets.forEach(({ name, propsDeclaration }) => {
            if (!propsDeclaration) return;

            const { props = [], extendTypes = [], equalType } = propsDeclaration;

            content.push(`### ${name} Props`);
            extendTypes.length && content.push(`> ${i18n['extends.from']} \`${extendTypes.join(', ')}\``);
            equalType && content.push(`> ${i18n['equal.with']} \`${equalType}\``);
            props.length &&
                content.push(
                    getMarkdownTable({
                        headers: [i18n['property.name'], i18n.description, i18n.type, i18n['default.value']],
                        rows: props.map(prop => [
                            `${prop.name}${prop.optional ? '' : '*'}`,
                            prop.description,
                            { text: prop.type, code: true },
                            { text: prop.defaultValue, code: true },
                        ]),
                    }),
                );
        });

        await writeFile(outputPath, `${content.join('\n\n')}\n`).then(() => {
            console.log(`output: ${relative(getRootDir(), outputPath)}`);
        });
    }
})();
