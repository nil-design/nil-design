import { bench, describe } from 'vitest';
import kebabize from '../index';

describe('kebabize', () => {
    bench('converts a compound identifier to kebab case', () => {
        kebabize('benchmarkComponent_property value');
    });
});
