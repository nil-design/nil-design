/* eslint-disable no-console */
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import i18n from '../../../locales/index.js';
import { getComponentApi, getMarkdownTable, getRootDir } from '../../../scripts/shared/index.js';

const { join } = posix;
const __dirname = fileURLToPath(new URL('.', import.meta.url)).replace(/\\/g, '/');
const srcDir = join(__dirname, '../src');
const entryPoint = join(srcDir, 'index.ts');

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

if (existsSync(entryPoint)) {
    console.log(`[${relative(getRootDir(), srcDir)}]:`);

    const api = await getComponentApi({
        entryPoint,
        tsconfig: join(__dirname, '../tsconfig.json'),
        fallbackName: 'Icon',
    });

    if (api.length > 0) {
        const outputPath = join(srcDir, 'API.zh-CN.md');

        await writeFile(outputPath, renderApi(api));

        console.log(`output: ${relative(getRootDir(), outputPath)}`);
    }
}
