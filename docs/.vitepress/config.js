/* eslint-disable no-console */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/postcss';
import postcssNested from 'postcss-nested';
import { defineConfig, postcssIsolateStyles } from 'vitepress';
import { getEmbeddingBuilder } from '../../scripts/shared';
import getAppearance from './getAppearance.js';
import getSearch from './getSearch.js';
import getThemeConfig from './getThemeConfig.js';
import mermaid from './theme/components/mermaid';
import reactLive from './theme/components/react-live';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const inProd = process.env.NODE_ENV === 'production';
const base = inProd ? '/nil-design/' : '/';
const ignoredWarningPatterns = inProd ? [/dynamic import will not move module into another chunk\./] : [];
const embeddingBuilder = getEmbeddingBuilder(base);

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
        search: getSearch(embeddingBuilder),
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
        build: {
            rollupOptions: {
                onwarn(warning, defaultHandler) {
                    if (ignoredWarningPatterns.some(pattern => pattern.test(warning.message))) {
                        return;
                    }
                    defaultHandler(warning);
                },
            },
        },
        css: {
            postcss: {
                plugins: [
                    postcssIsolateStyles({
                        includeFiles: [/vp-doc\.css/, /base\.css/],
                    }),
                    /**
                     * 1. Why not use @tailwindcss/vite?
                     * See: https://github.com/tailwindlabs/tailwindcss/issues/17408
                     */
                    tailwindcss(),
                    postcssNested,
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
    async buildEnd() {
        await embeddingBuilder
            .build(resolve(__dirname, '../public'))
            .then(() => {
                console.log('✓ embeddings built');
            })
            .catch(() => {
                console.error('✗ embeddings build failed');
            });
    },
});
