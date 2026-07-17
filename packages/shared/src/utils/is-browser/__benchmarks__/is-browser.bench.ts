// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import isBrowser from '../index';

describe('isBrowser', () => {
    bench('checks the browser environment', () => {
        isBrowser();
    });
});
