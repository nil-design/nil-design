// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import getDPR from '../index';

describe('getDPR', () => {
    bench('reads the current device pixel ratio', () => {
        getDPR();
    });
});
