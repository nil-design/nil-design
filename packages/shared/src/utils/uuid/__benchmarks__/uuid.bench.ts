import { bench, describe } from 'vitest';
import uuid from '../index';

describe('uuid', () => {
    bench('creates a standard UUID', () => {
        uuid();
    });
});
