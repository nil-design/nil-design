import { describe, expect, it } from 'vitest';
import I18n from '..';
import type { Plugin } from '..';

describe('I18n', () => {
    it('resolves missing keys through language fallback chain', () => {
        const i18n = new I18n({
            language: 'zh-CN',
            fallbackLanguages: ['en-US'],
            locales: {
                'zh-CN': {
                    __default: {
                        home: {
                            title: 'Title CN',
                        },
                    },
                },
                'en-US': {
                    __default: {
                        home: {
                            title: 'Title',
                            subtitle: 'Subtitle',
                        },
                    },
                },
            },
        });

        expect(i18n.t('home.subtitle')).toBe('Subtitle');
    });

    it('falls back to regional language before configured fallback languages', () => {
        const i18n = new I18n({
            language: 'zh-CN',
            fallbackLanguages: ['en-US'],
            locales: {
                zh: {
                    __default: {
                        greeting: 'Hello from zh',
                    },
                },
                'en-US': {
                    __default: {
                        greeting: 'Hello',
                    },
                },
            },
        });

        expect(i18n.t('greeting')).toBe('Hello from zh');
    });

    it('returns full key when namespace key is missing', () => {
        const i18n = new I18n({
            language: 'en-US',
            locales: {
                'en-US': {
                    common: {
                        title: 'Title',
                    },
                },
            },
        });

        expect(i18n.t('common:missing')).toBe('common:missing');
    });

    it('runs plugin hooks in order: beforeResolve → onMiss → afterResolve', () => {
        const eventTrail: string[] = [];
        const reporter: Plugin = {
            name: 'reporter',
            beforeResolve(payload) {
                eventTrail.push(`beforeResolve:${payload.key}`);
            },
            onMiss(payload) {
                eventTrail.push(`onMiss:${payload.key}`);
            },
            afterResolve(payload) {
                eventTrail.push(`afterResolve:${payload.result ?? 'empty'}`);
            },
        };
        const i18n = new I18n({
            language: 'en-US',
            plugins: [reporter],
            locales: {
                'en-US': {
                    __default: {},
                },
            },
        });

        expect(i18n.t('missing.key')).toBe('missing.key');
        expect(eventTrail).toEqual(['beforeResolve:missing.key', 'onMiss:missing.key', 'afterResolve:empty']);
    });

    it('supports replacing locale payload when localeWriteMode is replace', () => {
        const i18n = new I18n({
            language: 'en-US',
            localeWriteMode: 'replace',
            locales: {
                'en-US': {
                    __default: {
                        title: 'Title',
                        profile: {
                            name: 'Initial',
                        },
                    },
                },
            },
        });

        i18n.addLocale(
            { language: 'en-US' },
            {
                profile: {
                    name: 'Updated',
                },
            },
        );

        expect(i18n.t('title')).toBe('title');
        expect(i18n.t('profile.name')).toBe('Updated');
    });

    it('prefers root literal key when it collides with nested key path', () => {
        const i18n = new I18n({
            language: 'en-US',
            locales: {
                'en-US': {
                    __default: {
                        'home.title': 'Flat title',
                        home: {
                            title: 'Nested title',
                        },
                    },
                },
            },
        });

        expect(i18n.t('home.title')).toBe('Flat title');
    });

    it('resolves nested keys with custom key delimiter through flattened index', () => {
        const i18n = new I18n({
            language: 'en-US',
            keyDelimiter: '/',
            locales: {
                'en-US': {
                    __default: {
                        home: {
                            title: 'Title',
                        },
                    },
                },
            },
        });

        expect(i18n.t('home/title')).toBe('Title');
    });

    it('supports grouped fallbackLanguages by regional language key', () => {
        const i18n = new I18n({
            language: 'zh-CN',
            fallbackLanguages: {
                zh: ['en-US'],
            },
            locales: {
                'en-US': {
                    __default: {
                        tip: 'Tip',
                    },
                },
            },
        });

        expect(i18n.t('tip')).toBe('Tip');
    });

    it('clears cached language trail after setFallbackLanguages', () => {
        const i18n = new I18n({
            language: 'zh-CN',
            fallbackLanguages: ['en-US'],
            locales: {
                'en-US': {
                    __default: {
                        tip: 'Tip EN',
                    },
                },
                'ja-JP': {
                    __default: {
                        tip: 'Tip JP',
                    },
                },
            },
        });

        expect(i18n.t('tip')).toBe('Tip EN');

        i18n.setFallbackLanguages(['ja-JP']);

        expect(i18n.t('tip')).toBe('Tip JP');
    });

    it('uses key namespace before context namespace and instance namespace', () => {
        const i18n = new I18n({
            language: 'en-US',
            namespace: 'profile',
            defaultNamespace: 'common',
            locales: {
                'en-US': {
                    common: {
                        title: 'Common title',
                    },
                    profile: {
                        title: 'Profile title',
                    },
                },
            },
        });

        expect(i18n.t('title')).toBe('Profile title');
        expect(i18n.t('title', { namespace: 'common' })).toBe('Common title');
        expect(i18n.t('common:title', { namespace: 'profile' })).toBe('Common title');
    });

    it('deduplicates plugins by name and keeps registration order for transform', () => {
        const i18n = new I18n({
            language: 'en-US',
            plugins: [
                {
                    name: 'decorate',
                    transform(text) {
                        return `[${text}]`;
                    },
                },
                {
                    // Duplicate name should be ignored.
                    name: 'decorate',
                    transform(text) {
                        return `(${text})`;
                    },
                },
                {
                    name: 'suffix',
                    transform(text) {
                        return `${text}!`;
                    },
                },
            ],
            locales: {
                'en-US': {
                    __default: {
                        greeting: 'Hello',
                    },
                },
            },
        });

        expect(i18n.t('greeting')).toBe('[Hello]!');
    });

    it('merges locale payload by default when addLocale is called', () => {
        const i18n = new I18n({
            language: 'en-US',
            locales: {
                'en-US': {
                    __default: {
                        title: 'Title',
                        profile: {
                            name: 'Nil',
                        },
                    },
                },
            },
        });

        i18n.addLocale(
            { language: 'en-US' },
            {
                profile: {
                    age: '18',
                },
            },
        );

        expect(i18n.t('title')).toBe('Title');
        expect(i18n.t('profile.name')).toBe('Nil');
        expect(i18n.t('profile.age')).toBe('18');
    });

    it('ignores invalid locale namespace values from runtime inputs', () => {
        const i18n = new I18n({
            language: 'en-US',
            locales: {
                'en-US': {
                    __default: {
                        title: 'Title',
                    },
                    // Simulate JS runtime misuse.
                    invalid: 'not-an-object',
                },
            } as unknown as ConstructorParameters<typeof I18n>[0]['locales'],
        });

        expect(i18n.t('title')).toBe('Title');
        expect(i18n.t('invalid:any')).toBe('invalid:any');
    });

    it('switches translation language after setLanguage', () => {
        const i18n = new I18n({
            language: 'en-US',
            locales: {
                'en-US': {
                    __default: {
                        title: 'Title EN',
                    },
                },
                'zh-CN': {
                    __default: {
                        title: 'Title ZH',
                    },
                },
            },
        });

        expect(i18n.t('title')).toBe('Title EN');

        i18n.setLanguage('zh-CN');

        expect(i18n.t('title')).toBe('Title ZH');
    });

    it('switches default namespace after setNamespace', () => {
        const i18n = new I18n({
            language: 'en-US',
            defaultNamespace: 'common',
            locales: {
                'en-US': {
                    common: {
                        title: 'Common title',
                    },
                    profile: {
                        title: 'Profile title',
                    },
                },
            },
        });

        expect(i18n.t('title')).toBe('Common title');

        i18n.setNamespace('profile');

        expect(i18n.t('title')).toBe('Profile title');
    });

    it('parses namespaced key with custom namespace delimiter', () => {
        const i18n = new I18n({
            language: 'en-US',
            namespaceDelimiter: '/',
            locales: {
                'en-US': {
                    profile: {
                        title: 'Profile title',
                    },
                },
            },
        });

        expect(i18n.t('profile/title')).toBe('Profile title');
    });

    it('overrides instance language for a single t() call via context.language', () => {
        const i18n = new I18n({
            language: 'zh-CN',
            locales: {
                'zh-CN': {
                    __default: {
                        title: 'Title ZH',
                    },
                },
                'en-US': {
                    __default: {
                        title: 'Title EN',
                    },
                },
            },
        });

        expect(i18n.t('title')).toBe('Title ZH');
        expect(i18n.t('title', { language: 'en-US' })).toBe('Title EN');
        // Instance language is unchanged.
        expect(i18n.t('title')).toBe('Title ZH');
    });

    it('does not invoke transform when key is missing', () => {
        let transformCalled = false;
        const i18n = new I18n({
            language: 'en-US',
            plugins: [
                {
                    name: 'spy',
                    transform(text) {
                        transformCalled = true;

                        return text;
                    },
                },
            ],
            locales: {
                'en-US': {
                    __default: {},
                },
            },
        });

        i18n.t('missing.key');
        expect(transformCalled).toBe(false);
    });

    it('addLocale writes to the specified namespace', () => {
        const i18n = new I18n({
            language: 'en-US',
            locales: {
                'en-US': {
                    common: { title: 'Title' },
                },
            },
        });

        i18n.addLocale({ language: 'en-US', namespace: 'profile' }, { greeting: 'Hello' });

        expect(i18n.t('common:title')).toBe('Title');
        expect(i18n.t('profile:greeting')).toBe('Hello');
    });

    it('passes hit metadata to afterResolve hook', () => {
        const events: string[] = [];
        const i18n = new I18n({
            language: 'en-US',
            plugins: [
                {
                    name: 'uppercase',
                    transform(text) {
                        return text.toUpperCase();
                    },
                    afterResolve(payload) {
                        events.push(`language:${payload.language ?? 'none'}`);
                        events.push(`result:${payload.result ?? 'none'}`);
                    },
                },
            ],
            locales: {
                'en-US': {
                    __default: {
                        title: 'Title',
                    },
                },
            },
        });

        expect(i18n.t('title')).toBe('TITLE');
        expect(events).toEqual(['language:en-US', 'result:TITLE']);
    });
});
