import { bench, describe } from 'vitest';
import camelize from '../index';

describe('camelize', () => {
    bench('converts a compound identifier to camel case', () => {
        camelize('benchmark-component_property value');
    });
});
