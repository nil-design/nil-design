import { bench, describe } from 'vitest';
import makeArray from '../index';

describe('makeArray', () => {
    bench('normalizes scalar and array values', () => {
        makeArray('benchmark');
        makeArray(['benchmark']);
    });
});
