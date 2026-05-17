/* eslint-disable no-console */
import { existsSync } from 'node:fs';
import { readdir, writeFile } from 'node:fs/promises';
import { posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import i18n from '../../../locales/index.js';
import { getComponentApi, getMarkdownTable, getRootDir } from '../../../scripts/shared/index.js';

const { join } = posix;
const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\\/g, '/');
const srcDir = join(__dirname, '../src');
const tsconfig = join(__dirname, '../tsconfig.json');

const renderApi = api => {
    const content = [];

    api.forEach(({ name, props = [], extendTypes = [], equalType }) => {
        content.push(`### ${name} Props`);
        extendTypes.length && content.push(`> ${i18n.t('extends.from')} \`${extendTypes.join(', ')}\``);
        equalType && content.push(`> ${i18n.t('equal.with')} \`${equalType}\``);
        props.length &&
            content.push(
                getMarkdownTable({
                    headers: [i18n.t('property.name'), i18n.t('description'), i18n.t('type'), i18n.t('default.value')],
                    rows: props.map(prop => [
                        `${prop.name}${prop.optional ? '' : '*'}`,
                        prop.description,
                        { text: prop.type, code: true },
                        { text: prop.defaultValue, code: true },
                    ]),
                }),
            );
    });

    return `${content.join('\n\n')}\n`;
};

i18n.setLanguage('zh-CN');

for (const dirent of await readdir(srcDir, { withFileTypes: true })) {
    const direntPath = join(srcDir, dirent.name);
    const entryPoint = join(direntPath, 'index.ts');

    if (!dirent.isDirectory() || dirent.name.startsWith('_') || !existsSync(entryPoint)) continue;

    console.log(`[${relative(getRootDir(), direntPath)}]:`);

    const api = await getComponentApi({
        entryPoint,
        tsconfig,
        fallbackName: dirent.name
            .split('-')
            .map(part => `${part[0].toUpperCase()}${part.slice(1)}`)
            .join(''),
    });

    if (api.length === 0) continue;

    const outputPath = join(direntPath, 'API.zh-CN.md');

    await writeFile(outputPath, renderApi(api));

    console.log(`output: ${relative(getRootDir(), outputPath)}`);
}
