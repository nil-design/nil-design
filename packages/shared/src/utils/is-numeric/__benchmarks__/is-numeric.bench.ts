import { bench, describe } from 'vitest';
import isNumeric from '../index';

describe('isNumeric', () => {
    bench('checks representative numeric strings', () => {
        isNumeric('123.45');
        isNumeric('-42');
        isNumeric('12px');
    });
});
