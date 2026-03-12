import I18n, { interpolator } from '@nild/i18n';
import enUS from './en-US.json' with { type: 'json' };
import zhCN from './zh-CN.json' with { type: 'json' };

const i18n = new I18n({
    language: 'zh-CN',
    fallbackLanguages: ['en-US'],
    plugins: [interpolator()],
    locales: {
        'zh-CN': zhCN,
        'en-US': enUS,
    },
});

export default i18n;
