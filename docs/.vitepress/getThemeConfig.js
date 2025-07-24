import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isUndefined, last } from 'lodash-es';
import i18n from '../../locales/index.js';
import { getDocsWithMatter } from '../../scripts/shared/index.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const docsDir = join(__dirname, '..');

/**
 * @param {string} locale
 * @returns {import('vitepress').DefaultTheme.Outline}
 */
const getOutline = locale => {
    return {
        level: 'deep',
        label: i18n.t('outline.label', { language: locale }),
    };
};

/**
 * @param {string} locale
 * @returns {import('vitepress').DefaultTheme.Footer}
 */
const getFooter = locale => {
    const licenseAnchor = '<a href="https://github.com/nil-design/nil-design/blob/main/LICENSE">Apache License 2.0</a>';
    const copyrightAnchor = '<a href="https://github.com/Morilence">Morilence</a>';

    return {
        message: i18n.t('footer.message', { language: locale, parameters: { licenseAnchor } }),
        copyright: i18n.t('footer.copyright', { language: locale, parameters: { copyrightAnchor } }),
    };
};

/**
 * @param {string} locale
 * @returns {import('vitepress').DefaultTheme.DocFooter}
 */
const getDocFooter = locale => {
    return {
        prev: i18n.t('prev.page', { language: locale }),
        next: i18n.t('next.page', { language: locale }),
    };
};

/**
 * @param {string} locale
 * @returns {import('vitepress').DefaultTheme.Config['lastUpdated']}
 */
const getLastUpdated = locale => {
    return {
        text: i18n.t('last.updated', { language: locale }),
        formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short',
        },
    };
};

const getEditLink = locale => {
    return {
        pattern: 'https://github.com/nil-design/nil-design/edit/main/docs/:path',
        text: i18n.t('edit.this.page.on.github', { language: locale }),
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
            let navValid = false;
            const navName = dirent.name;
            const navDir = join(localeDir, dirent.name);
            const categories = [];

            getDocsWithMatter(navDir).forEach(({ path: docPath, data }) => {
                if (docPath === join(navDir, 'index.md')) {
                    const { title, navOrder = 0, rewrite = '', dropdown } = data;
                    nav.push({
                        text: title,
                        link: `/${locale}/${navName}${rewrite.startsWith('/') ? rewrite : `/${rewrite}`}`,
                        activeMatch: `/${locale}/${navName}/`,
                        navOrder,
                        dropdown,
                    });
                    navValid = true;
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

            if (navValid) {
                const curNav = last(nav);
                if (curNav.dropdown) {
                    curNav.link = undefined;
                    curNav.items = categories.reduce(
                        (items, category) =>
                            items.concat(
                                category.items.map(item => ({
                                    ...item,
                                    link: `/${locale}/${navName}/${item.link}`,
                                })),
                            ),
                        [],
                    );
                }
            }
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
        outline: getOutline(locale),
        lastUpdated: getLastUpdated(locale),
        editLink: getEditLink(locale),
        footer: getFooter(locale),
        docFooter: getDocFooter(locale),
    };
};

export default getThemeConfig;
