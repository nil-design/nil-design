// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import isMobile from '../index';

describe('isMobile', () => {
    bench('checks mobile browser signals', () => {
        isMobile();
    });
});
