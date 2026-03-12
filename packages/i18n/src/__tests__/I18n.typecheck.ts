import I18n from '..';
import type { PluginFactory } from '..';

const strictI18n = new I18n({
    strict: true,
    defaultNamespace: 'common',
    locales: {
        'en-US': {
            common: {
                title: 'Title',
                home: {
                    subtitle: 'Subtitle',
                },
            },
            profile: {
                greeting: 'Hello',
            },
        },
    },
});

strictI18n.t('title');
strictI18n.t('home.subtitle');
strictI18n.t('common:title');
strictI18n.t('profile:greeting');
strictI18n.t('greeting', { namespace: 'profile' });
strictI18n.t('title', { namespace: 'common' });

// @ts-expect-error key is not declared in strict locales
strictI18n.t('missing.key');

// @ts-expect-error namespaced key is not declared in strict locales
strictI18n.t('profile:missing');

// @ts-expect-error namespaced key uses unknown namespace
strictI18n.t('unknown:title');

// @ts-expect-error bare key belongs to profile namespace, but default namespace is common
strictI18n.t('greeting');

// @ts-expect-error key does not belong to provided namespace
strictI18n.t('title', { namespace: 'profile' });

// @ts-expect-error namespace is not declared in strict locales
strictI18n.t('title', { namespace: 'unknown' });

const looseI18n = new I18n({
    locales: {
        'en-US': {
            __default: {
                title: 'Title',
            },
        },
    },
});

looseI18n.t('any.custom.key');
looseI18n.t('any.custom.key', { namespace: 'whatever' });

const strictDefaultNamespaceI18n = new I18n({
    strict: true,
    locales: {
        'en-US': {
            __default: {
                title: 'Title',
            },
            profile: {
                greeting: 'Hello',
            },
        },
    },
});

strictDefaultNamespaceI18n.t('title');
strictDefaultNamespaceI18n.t('profile:greeting');
strictDefaultNamespaceI18n.t('greeting', { namespace: 'profile' });

// @ts-expect-error bare key does not belong to implicit __default namespace
strictDefaultNamespaceI18n.t('greeting');

const _invalidLocales: ConstructorParameters<typeof I18n>[0]['locales'] = {
    'en-US': {
        // @ts-expect-error locales must be language -> namespace -> locale
        title: 'Title',
    },
};

const withParameters: PluginFactory<void, { parameters: { user: { name: string } } }> = () => ({
    name: 'with-parameters',
});

const withExtra: PluginFactory<void, { extra?: { id: number } }> = () => ({
    name: 'with-extra',
});

const pluginTypedI18n = new I18n({
    strict: true,
    defaultNamespace: 'common',
    plugins: [withParameters(), withExtra()],
    locales: {
        'en-US': {
            common: {
                title: 'Title',
            },
        },
    },
});

pluginTypedI18n.t('title', { parameters: { user: { name: 'Nil' } } });
pluginTypedI18n.t('title', { parameters: { user: { name: 'Nil' } }, extra: { id: 1 } });

// @ts-expect-error plugin context parameters shape mismatch
pluginTypedI18n.t('title', { parameters: { user: {} } });

// @ts-expect-error plugin context extra.id should be number
pluginTypedI18n.t('title', { parameters: { user: { name: 'Nil' } }, extra: { id: 'x' } });

// Loose mode with plugin context extension.
const withCount: PluginFactory<void, { count?: number }> = () => ({
    name: 'with-count',
});

const loosePluginI18n = new I18n({
    plugins: [withCount()],
    locales: {
        'en-US': {
            __default: { title: 'Title' },
        },
    },
});

loosePluginI18n.t('any.key');
loosePluginI18n.t('any.key', { count: 3 });

// @ts-expect-error count must be a number, not a string
loosePluginI18n.t('any.key', { count: 'three' });

export {};
