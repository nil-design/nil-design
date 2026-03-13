import { describe, expect, it } from 'vitest';
import isNumeric from '../index';

describe('isNumeric', () => {
    it('should return true for finite numeric numbers', () => {
        expect(isNumeric(0)).toBe(true);
        expect(isNumeric(12.5)).toBe(true);
        expect(isNumeric(-3)).toBe(true);
    });

    it('should return false for NaN and Infinity', () => {
        expect(isNumeric(Number.NaN)).toBe(false);
        expect(isNumeric(Number.POSITIVE_INFINITY)).toBe(false);
    });

    it('should return true for normalized numeric strings', () => {
        expect(isNumeric('10')).toBe(true);
        expect(isNumeric(' 10 ')).toBe(true);
    });

    it('should return false for non-normalized or non-numeric strings', () => {
        expect(isNumeric('01')).toBe(false);
        expect(isNumeric('1e3')).toBe(false);
        expect(isNumeric('1.0')).toBe(false);
        expect(isNumeric('abc')).toBe(false);
        expect(isNumeric('   ')).toBe(false);
    });
});
