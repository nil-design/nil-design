import { afterEach, describe, expect, it, vi } from 'vitest';
import getComputedStyleValue from '../index';

describe('getComputedStyleValue', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('gets computed style by key', () => {
        const $element = document.createElement('div');

        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            color: 'currentColor',
        } as CSSStyleDeclaration);

        expect(getComputedStyleValue($element, 'color')).toBe('currentColor');
    });

    it('gets computed style through a getter', () => {
        const $element = document.createElement('div');

        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            getPropertyValue: property => (property === '--token' ? 'value' : ''),
        } as CSSStyleDeclaration);

        expect(getComputedStyleValue($element, style => style.getPropertyValue('--token'))).toBe('value');
    });

    it('returns undefined when the element is missing', () => {
        const getComputedStyle = vi.spyOn(window, 'getComputedStyle');

        expect(getComputedStyleValue(null, 'color')).toBeUndefined();
        expect(getComputedStyle).not.toHaveBeenCalled();
    });
});
