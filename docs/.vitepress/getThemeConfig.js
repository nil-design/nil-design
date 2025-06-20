import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isUndefined } from 'lodash-es';
import locales from '../../scripts/locales/index.js';
import { getDocsWithMatter } from '../../scripts/shared/index.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const docsDir = join(__dirname, '..');

/**
 * @param {string} locale
 * @returns {import('vitepress').DefaultTheme.Footer}
 */
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

/**
 * @param {string} locale
 * @returns {import('vitepress').DefaultTheme.Config['lastUpdated']}
 */
const getLastUpdated = locale => {
    return {
        text: locales[locale]['last.updated'],
        formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short',
        },
    };
};

/**
 * @param {string} locale
 * @returns {{
 *  nav: (import('vitepress').DefaultTheme.NavItem)[],
 *  sidebar: Record<string, (import('vitepress').DefaultTheme.SidebarItem)[]>,
 * }}
 */
const getNavAndSidebar = locale => {
    const nav = [];
    const sidebar = {};
    const localeDir = join(docsDir, locale);

    if (!existsSync(localeDir)) {
        return { nav: [], sidebar: {} };
    }

    readdirSync(localeDir, { withFileTypes: true }).forEach(dirent => {
        if (dirent.isDirectory()) {
            const navName = dirent.name;
            const navDir = join(localeDir, dirent.name);
            const categories = [];

            getDocsWithMatter(navDir).forEach(({ path: docPath, data }) => {
                if (docPath === join(navDir, 'index.md')) {
                    const { title, navOrder = 0, rewrite = '' } = data;
                    nav.push({
                        text: title,
                        link: `/${locale}/${navName}${rewrite.startsWith('/') ? rewrite : `/${rewrite}`}`,
                        activeMatch: `/${locale}/${navName}/`,
                        navOrder,
                    });
                } else {
                    const { title, order = 0, cat, catOrder } = data;
                    const link = relative(navDir, docPath).replace(/\\/, '/');
                    if (cat) {
                        const item = {
                            text: title,
                            link,
                            order,
                        };
                        const categoryIdx = categories.findIndex(({ text }) => text === cat);
                        if (categoryIdx === -1) {
                            categories.push({ text: cat, items: [item], catOrder });
                        } else {
                            if (!isUndefined(catOrder)) {
                                categories[categoryIdx].catOrder = catOrder;
                            }
                            categories[categoryIdx].items.push(item);
                        }
                    } else if (title) {
                        categories.push({
                            text: title,
                            link,
                        });
                    }
                }
            });

            categories.sort((a, b) => a.catOrder - b.catOrder);
            categories.forEach(category => {
                category.items?.sort((a, b) => a.order - b.order);
            });

            sidebar[`/${locale}/${navName}`] = {
                base: `/${locale}/${navName}/`,
                items: categories,
            };
        }
    }, {});

    nav.sort((a, b) => a.navOrder - b.navOrder);

    return { nav, sidebar };
};

/**
 * @param {string} locale
 * @returns {import('vitepress').DefaultTheme.Config}
 */
const getThemeConfig = locale => {
    return {
        ...getNavAndSidebar(locale),
        lastUpdated: getLastUpdated(locale),
        footer: getFooter(locale),
    };
};

export default getThemeConfig;
