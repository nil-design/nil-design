import { describe, expect, it } from 'vitest';
import I18n from '../src';
import type { Plugin } from '../src/PluginManager';

describe('I18n', () => {
    it('resolves missing keys through language fallback trail', () => {
        const i18n = new I18n({
            language: 'zh-CN',
            fallbackLanguages: ['en-US'],
            locales: {
                'zh-CN': {
                    home: {
                        title: '标题',
                    },
                },
                'en-US': {
                    home: {
                        title: 'Title',
                        subtitle: 'Subtitle',
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
                    greeting: '你好',
                },
                'en-US': {
                    greeting: 'Hello',
                },
            },
        });

        expect(i18n.t('greeting')).toBe('你好');
    });

    it('returns full key when namespace key is missing', () => {
        const i18n = new I18n({
            language: 'en-US',
            locales: {
                'en-US': [
                    {
                        namespace: 'common',
                        locale: {
                            title: 'Title',
                        },
                    },
                ],
            },
        });

        expect(i18n.t('common:missing')).toBe('common:missing');
    });

    it('runs plugin resolve hooks and missing hook in order', () => {
        const eventTrail: string[] = [];
        const reporter: Plugin = {
            name: 'reporter',
            resolving(payload) {
                eventTrail.push(`resolving:${payload.key}`);
            },
            missing(payload) {
                eventTrail.push(`missing:${payload.key}`);
            },
            resolved(payload) {
                eventTrail.push(`resolved:${payload.result ?? 'empty'}`);
            },
        };
        const i18n = new I18n({
            language: 'en-US',
            plugins: [reporter],
            locales: {
                'en-US': {},
            },
        });

        expect(i18n.t('missing.key')).toBe('missing.key');
        expect(eventTrail).toEqual(['resolving:missing.key', 'missing:missing.key', 'resolved:empty']);
    });

    it('supports replacing locale payload when localeWriteMode is replace', () => {
        const i18n = new I18n({
            language: 'en-US',
            localeWriteMode: 'replace',
            locales: {
                'en-US': {
                    title: 'Title',
                    profile: {
                        name: 'Initial',
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
});
