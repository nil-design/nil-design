import { bench, describe } from 'vitest';
import pascalize from '../index';

describe('pascalize', () => {
    bench('converts a compound identifier to pascal case', () => {
        pascalize('benchmark-component_property value');
    });
});
