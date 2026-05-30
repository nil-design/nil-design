// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { createSuggestions, getPageSubject, getSuggestionGroup } from '../runtime/suggestions';

const i18n = {
    t: (key, { language, parameters }) => `${language}:${key}:${parameters.subject}`,
};

describe('assistant empty-state suggestions', () => {
    it.each([
        ['/zh-CN/components/button/', 'COMPONENT'],
        ['/en-US/hooks/use-click-outside.html', 'HOOK'],
        ['/zh-CN/components/index.html', null],
        ['/zh-CN/guide/', null],
    ])('detects suggestion group for %s', (routePath, group) => {
        expect(getSuggestionGroup(routePath)).toBe(group);
    });

    it('reads the visible page subject without heading anchors', () => {
        document.body.innerHTML = '<div class="vp-doc"><h1>Button <a href="#button">#</a></h1></div>';

        expect(getPageSubject(document)).toBe('Button');
    });

    it('creates up to three localized component suggestions', () => {
        const suggestions = createSuggestions({
            i18n,
            locale: 'zh-CN',
            random: () => 0,
            routePath: '/zh-CN/components/button/',
            subject: 'Button',
        });

        expect(suggestions).toHaveLength(3);
        expect(suggestions.every(suggestion => suggestion.includes('zh-CN:assistant.suggestion.component'))).toBe(true);
        expect(suggestions.every(suggestion => suggestion.endsWith(':Button'))).toBe(true);
    });

    it('returns no suggestions without a supported route or subject', () => {
        expect(
            createSuggestions({
                i18n,
                locale: 'zh-CN',
                routePath: '/zh-CN/guide/',
                subject: 'Guide',
            }),
        ).toEqual([]);
        expect(
            createSuggestions({
                i18n,
                locale: 'zh-CN',
                routePath: '/zh-CN/hooks/use-toggle/',
                subject: '',
            }),
        ).toEqual([]);
    });
});
