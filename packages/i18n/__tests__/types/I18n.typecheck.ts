import I18n from '../../src';

const strictI18n = new I18n({
    strictKey: true,
    defaultNamespace: 'common',
    locales: {
        'en-US': [
            {
                namespace: 'common',
                locale: {
                    title: 'Title',
                    home: {
                        subtitle: 'Subtitle',
                    },
                },
            },
            {
                namespace: 'profile',
                locale: {
                    greeting: 'Hello',
                },
            },
        ],
    },
});

strictI18n.t('title');
strictI18n.t('home.subtitle');
strictI18n.t('common:title');
strictI18n.t('profile:greeting');
strictI18n.t('greeting', { namespace: 'profile' });

// @ts-expect-error key is not declared in strict locales
strictI18n.t('missing.key');

// @ts-expect-error namespaced key is not declared in strict locales
strictI18n.t('profile:missing');

// @ts-expect-error namespace is not declared in strict locales
strictI18n.t('title', { namespace: 'unknown' });

const looseI18n = new I18n({
    locales: {
        'en-US': {
            title: 'Title',
        },
    },
});

looseI18n.t('any.custom.key');
looseI18n.t('any.custom.key', { namespace: 'whatever' });

export {};
