import tailwindcss from '@tailwindcss/vite';
import postcssNested from 'postcss-nested';
import { defineConfig, postcssIsolateStyles } from 'vitepress';
import getAppearance from './getAppearance.js';
import getSearch from './getSearch.js';
import getThemeConfig from './getThemeConfig.js';
import mermaid from './theme/components/mermaid';
import reactLive from './theme/components/react-live';

const inProd = process.env.NODE_ENV === 'production';
const base = inProd ? '/nil-design/' : '/';

export default defineConfig({
    base,
    title: 'Nil Design',
    description: 'A Diversified React Development Library',
    appearance: getAppearance(),
    head: [
        [
            'link',
            {
                rel: 'icon',
                href: `${base}favicon.svg`,
                type: 'image/svg+xml',
            },
        ],
        // Google Analytics
        ...(inProd
            ? [
                  ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-QY7QYF0FC8' }],
                  [
                      'script',
                      {},
                      [
                          'window.dataLayer = window.dataLayer || [];',
                          'function gtag(){dataLayer.push(arguments);}',
                          'gtag("js", new Date());',
                          'gtag("config", "G-QY7QYF0FC8");',
                      ].join(''),
                  ],
              ]
            : []),
    ],
    sitemap: {
        hostname: 'https://nil-design.github.io/nil-design/',
    },
    lastUpdated: true,
    themeConfig: {
        logo: '/logo.svg',
        siteTitle: false,
        i18nRouting: false,
        socialLinks: [
            { icon: 'npm', link: 'https://www.npmjs.com/org/nild' },
            { icon: 'github', link: 'https://github.com/nil-design/nil-design' },
        ],
        search: getSearch(),
    },
    locales: {
        'zh-CN': {
            label: '简体中文',
            lang: 'zh-CN',
            link: '/zh-CN/',
            themeConfig: getThemeConfig('zh-CN'),
        },
        'en-US': {
            label: 'English',
            lang: 'en-US',
            link: '/en-US/',
            themeConfig: getThemeConfig('en-US'),
        },
    },
    vite: {
        plugins: [tailwindcss()],
        css: {
            postcss: {
                plugins: [
                    postcssNested,
                    postcssIsolateStyles({
                        includeFiles: [/vp-doc\.css/, /base\.css/],
                    }),
                ],
            },
        },
    },
    markdown: {
        config: md => {
            md.use(reactLive);
            md.use(mermaid);
        },
    },
});
