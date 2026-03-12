import I18n, { interpolator } from '@nild/i18n';
import enUS from './en-US.json' with { type: 'json' };
import zhCN from './zh-CN.json' with { type: 'json' };

const i18n = new I18n({
    strict: true,
    language: 'zh-CN',
    fallbackLanguages: ['en-US'],
    plugins: [interpolator()],
    locales: {
        'zh-CN': {
            __default: zhCN,
        },
        'en-US': {
            __default: enUS,
        },
    },
});

export default i18n;
