import { describe, expect, it } from 'vitest';
import makeArray from '../index';

describe('makeArray', () => {
    it('should wrap non-array values into a new array', () => {
        expect(makeArray('value')).toEqual(['value']);
        expect(makeArray(1)).toEqual([1]);
    });

    it('should return the original array reference when value is already an array', () => {
        const value = [1, 2, 3];

        expect(makeArray(value)).toBe(value);
    });
});
