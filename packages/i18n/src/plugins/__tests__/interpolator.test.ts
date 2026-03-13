import { describe, expect, it } from 'vitest';
import I18n, { interpolator } from '../..';

describe('interpolator', () => {
    it('should replace placeholders with default tokens', () => {
        const i18n = new I18n({
            language: 'en-US',
            plugins: [interpolator()],
            locales: {
                'en-US': {
                    __default: {
                        greeting: 'Hello {{ user }}!',
                    },
                },
            },
        });

        expect(i18n.t('greeting', { parameters: { user: 'Nil' } })).toBe('Hello Nil!');
    });

    it('should resolve dotted token paths and prefer direct parameter keys', () => {
        const i18n = new I18n({
            language: 'en-US',
            plugins: [interpolator()],
            locales: {
                'en-US': {
                    __default: {
                        nested: 'Nested: {{ user.name }}',
                        direct: 'Direct: {{ user.name }}',
                    },
                },
            },
        });

        expect(i18n.t('nested', { parameters: { user: { name: 'Nested value' } } })).toBe('Nested: Nested value');
        expect(i18n.t('direct', { parameters: { user: { name: 'Nested value' }, 'user.name': 'Flat value' } })).toBe(
            'Direct: Flat value',
        );
    });

    it('should keep placeholder text when token value is missing', () => {
        const i18n = new I18n({
            language: 'en-US',
            plugins: [interpolator()],
            locales: {
                'en-US': {
                    __default: {
                        greeting: 'Hello {{ user.nickname }}',
                    },
                },
            },
        });

        expect(i18n.t('greeting', { parameters: { user: { name: 'Nil' } } })).toBe('Hello {{ user.nickname }}');
    });

    it('should support custom tokens with regex-sensitive characters', () => {
        const i18n = new I18n({
            language: 'en-US',
            plugins: [interpolator({ openToken: '${', closeToken: '}' })],
            locales: {
                'en-US': {
                    __default: {
                        greeting: 'Hello ${ user.name } and {{ untouched }}',
                    },
                },
            },
        });

        expect(i18n.t('greeting', { parameters: { user: { name: 'Nil' } } })).toBe('Hello Nil and {{ untouched }}');
    });
});
