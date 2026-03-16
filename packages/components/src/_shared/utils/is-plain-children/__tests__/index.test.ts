import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import isPlainChildren from '..';

describe('isPlainChildren', () => {
    it('returns true for strings', () => {
        expect(isPlainChildren('plain text')).toBe(true);
    });

    it('returns true for numbers', () => {
        expect(isPlainChildren(42)).toBe(true);
    });

    it('returns true for arrays of plain values', () => {
        expect(isPlainChildren(['alpha', 1, 'beta'])).toBe(true);
    });

    it('returns false for null values', () => {
        expect(isPlainChildren(null)).toBe(false);
    });

    it('returns false when react elements are included', () => {
        expect(isPlainChildren(['alpha', createElement('span', null, 'beta')])).toBe(false);
    });
});
