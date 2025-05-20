import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vitepress';
import reactLive from './theme/components/react-live';
import { getThemeConfig } from './utils';

export default defineConfig({
    title: 'Nil Design',
    description: 'A Diversified React Development Library',
    themeConfig: {
        logo: '/logo.svg',
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
