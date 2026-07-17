// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import roundByDPR from '../index';

describe('roundByDPR', () => {
    bench('rounds values to the current device pixel ratio', () => {
        roundByDPR(10.375);
    });
});
