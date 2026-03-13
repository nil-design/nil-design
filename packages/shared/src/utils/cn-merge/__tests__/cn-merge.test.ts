import { describe, expect, it } from 'vitest';
import cnMerge from '../index';

describe('cnMerge', () => {
    it('should merge conflicting tailwind utilities and keep the latest one', () => {
        expect(cnMerge('p-2', 'p-4')).toBe('p-4');
    });

    it('should accept array and dictionary values before applying merge', () => {
        expect(cnMerge('text-sm', ['font-bold', { 'text-lg': true }], { block: true, hidden: false })).toBe(
            'font-bold text-lg block',
        );
    });
});
