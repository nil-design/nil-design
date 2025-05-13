import { defineConfig } from 'vitepress';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import reactLive from './theme/components/react-live';

export default defineConfig({
    title: 'Nil Design',
    description: 'A Diversified React Development Library',
    themeConfig: {
        logo: '/logo.svg',
        nav: [
            { text: '指南', link: '/guide/' },
            { text: '组件', link: '/components/' },
            { text: '物料', link: '/materials/' },
            { text: 'Hooks', link: '/hooks/' },
            { text: '国际化', link: '/i18n/' },
        ],
        sidebar: {
            '/guide/': [
                {
                    text: '简介',
                    items: [],
                },
                {
                    text: '自定义',
                    items: [],
                },
            ],
            '/components/': [
                {
                    text: '基础组件',
                    items: [{ text: 'Button 按钮', link: '/components/button' }],
                },
            ],
            '/hooks/': [
                {
                    text: 'Hooks',
                    items: [],
                },
            ],
            '/i18n/': [
                {
                    text: '国际化',
                    items: [],
                },
            ],
            '/materials/': [
                {
                    text: '物料',
                    items: [],
                },
            ],
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/nil-design/nil-design' }],
    },
    vite: {
        css: {
            postcss: {
                plugins: [autoprefixer, tailwindcss],
            },
        },
    },
    markdown: {
        config: md => {
            md.use(reactLive);
        },
    },
});
