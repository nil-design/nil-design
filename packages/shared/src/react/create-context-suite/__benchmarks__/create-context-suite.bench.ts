import { bench, describe } from 'vitest';
import createContextSuite from '../index';

describe('createContextSuite', () => {
    bench('creates a provider and context hook', () => {
        createContextSuite({ displayName: 'BenchmarkContext', defaultValue: { value: 0 } });
    });
});
