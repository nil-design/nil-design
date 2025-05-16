import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vitepress';
import reactLive from './theme/components/react-live';

export default defineConfig({
    title: 'Nil Design',
    description: 'A Diversified React Development Library',
    themeConfig: {
        logo: '/logo.svg',
        socialLinks: [{ icon: 'github', link: 'https://github.com/nil-design/nil-design' }],
    },
    locales: {
        root: {
            label: '简体中文',
            lang: 'zh-CN',
            themeConfig: {
                nav: [
                    { text: '指南', link: '/zh-CN/guide/', activeMatch: '/zh-CN/guide/' },
                    { text: '组件', link: '/zh-CN/components/', activeMatch: '/zh-CN/components/' },
                    { text: '物料', link: '/zh-CN/materials/', activeMatch: '/zh-CN/materials/' },
                    { text: 'Hooks', link: '/zh-CN/hooks/', activeMatch: '/zh-CN/hooks/' },
                    { text: '国际化', link: '/zh-CN/i18n/', activeMatch: '/zh-CN/i18n/' },
                ],
                sidebar: {
                    '/zh-CN/guide/': [
                        {
                            text: '简介',
                            items: [],
                        },
                        {
                            text: '自定义',
                            items: [],
                        },
                    ],
                    '/zh-CN/components/': [
                        {
                            text: '基础组件',
                            items: [{ text: 'Button 按钮', link: '/zh-CN/components/button/' }],
                        },
                    ],
                    '/zh-CN/hooks/': [
                        {
                            text: 'Hooks',
                            items: [],
                        },
                    ],
                    '/zh-CN/i18n/': [
                        {
                            text: '国际化',
                            items: [],
                        },
                    ],
                    '/zh-CN/materials/': [
                        {
                            text: '物料',
                            items: [],
                        },
                    ],
                },
            },
        },
        'en-US': {
            label: 'English',
            lang: 'en-US',
        },
    },
    vite: {
        css: {
            postcss: {
                plugins: [postcssNested, autoprefixer, tailwindcss],
            },
        },
    },
    markdown: {
        config: md => {
            md.use(reactLive);
        },
    },
});
