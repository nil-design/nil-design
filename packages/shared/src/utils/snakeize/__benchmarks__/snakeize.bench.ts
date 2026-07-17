import { bench, describe } from 'vitest';
import snakeize from '../index';

describe('snakeize', () => {
    bench('converts a compound identifier to snake case', () => {
        snakeize('benchmarkComponent-property value');
    });
});
