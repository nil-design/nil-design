import tailwindcss from '@tailwindcss/vite';
import postcssNested from 'postcss-nested';
import { defineConfig, postcssIsolateStyles } from 'vitepress';
import mermaid from './theme/components/mermaid';
import reactLive from './theme/components/react-live';
import { getThemeConfig } from './utils';

export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/nil-design/' : '/',
    title: 'Nil Design',
    description: 'A Diversified React Development Library',
    themeConfig: {
        logo: '/logo.svg',
        siteTitle: false,
        i18nRouting: false,
        socialLinks: [{ icon: 'github', link: 'https://github.com/nil-design/nil-design' }],
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
