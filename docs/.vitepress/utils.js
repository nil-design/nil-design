import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const docsDir = join(__dirname, '..');

const getFooter = locale => {
    const licenseAnchor = '<a href="https://github.com/nil-design/nil-design/blob/main/LICENSE">Apache License 2.0</a>';
    const copyrightAnchor = '<a href="https://github.com/Morilence">Morilence</a>';

    return {
        'zh-CN': {
            message: `基于 ${licenseAnchor} 发布`,
            copyright: `版权所有 © 2025-present ${copyrightAnchor}`,
        },
        'en-US': {
            message: `Released under the ${licenseAnchor}`,
            copyright: `Copyright © 2025-present ${copyrightAnchor}`,
        },
    }[locale];
};

const getDocsWithTitle = dir => {
    return readdirSync(dir, { withFileTypes: true }).reduce((docs, dirent) => {
        const direntPath = join(dir, dirent.name);
        if (dirent.isDirectory()) {
            docs.push(...getDocsWithTitle(direntPath));
        } else if (dirent.isFile() && dirent.name.endsWith('.md')) {
            const { data, content } = matter.read(direntPath);
            if (data.title) {
                docs.push({ path: direntPath, data, content });
            }
        }
        return docs;
    }, []);
};

/**
 * @param {string} locale
 * @returns {{nav: (import('vitepress').DefaultTheme.NavItem)[], sidebar: Record<string, (import('vitepress').DefaultTheme.SidebarItem)[]>}}
 */
export const getThemeConfig = locale => {
    const navs = [];
    const sidebars = {};
    const localeDir = join(docsDir, locale);

    if (!existsSync(localeDir)) {
        return { nav: [], sidebar: {} };
    }

    readdirSync(localeDir, { withFileTypes: true }).forEach(dirent => {
        if (dirent.isDirectory()) {
            const navName = dirent.name;
            const navDir = join(localeDir, dirent.name);
            const categories = [];

            getDocsWithTitle(navDir).forEach(({ path: docPath, data }) => {
                if (docPath === join(navDir, 'index.md')) {
                    const { title, order = 0 } = data;
                    navs.push({
                        text: title,
                        link: `/${locale}/${navName}/`,
                        activeMatch: `/${locale}/${navName}/`,
                        order,
                    });
                } else {
                    const { title, category, order = 0 } = data;
                    if (category) {
                        const item = {
                            text: title,
                            link: relative(navDir, docPath).replace(/\\/, '/'),
                            order,
                        };
                        const categoryIdx = categories.findIndex(({ text }) => text === category);
                        if (categoryIdx === -1) {
                            categories.push({ text: category, items: [item] });
                        } else {
                            categories[categoryIdx].items.push(item);
                        }
                    }
                }
            });

            categories.sort((a, b) => a.order - b.order);
            categories.forEach(category => {
                category.items.sort((a, b) => a.order - b.order);
            });

            sidebars[`/${locale}/${navName}`] = {
                base: `/${locale}/${navName}/`,
                items: categories,
            };
        }
    }, {});

    navs.sort((a, b) => a.order - b.order);

    return { nav: navs, sidebar: sidebars, footer: getFooter(locale) };
};
