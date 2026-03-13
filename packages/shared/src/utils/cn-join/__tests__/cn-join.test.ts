import { describe, expect, it } from 'vitest';
import cnJoin from '../index';

describe('cnJoin', () => {
    it('should join strings and numbers while skipping falsy top-level values', () => {
        expect(cnJoin('btn', 1, 0, '', false, null, undefined, 'active')).toBe('btn 1 active');
    });

    it('should flatten nested arrays and class dictionaries', () => {
        expect(
            cnJoin('base', ['nested', ['deep', { hidden: false, visible: true }]], {
                selected: true,
                disabled: false,
            }),
        ).toBe('base nested deep visible selected');
    });

    it('should return empty string when there are no valid class tokens', () => {
        expect(cnJoin(undefined, null, false, '')).toBe('');
    });
});
