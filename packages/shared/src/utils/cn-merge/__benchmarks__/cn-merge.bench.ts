import { bench, describe } from 'vitest';
import cnMerge from '../index';

describe('cnMerge', () => {
    let index = 0;

    bench('merges uncached conflicting utility classes', () => {
        cnMerge(
            'flex items-center px-2 py-1 text-sm',
            'px-4 text-base',
            `data-[benchmark=${index++}]:block hover:bg-brand disabled:opacity-50`,
        );
    });
});
