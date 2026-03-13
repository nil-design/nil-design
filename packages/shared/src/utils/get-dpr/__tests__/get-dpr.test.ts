import { beforeEach, describe, expect, it, vi } from 'vitest';
import getDPR from '../index';

const { mockedIsBrowser } = vi.hoisted(() => ({
    mockedIsBrowser: vi.fn(),
}));

vi.mock('../../is-browser', () => ({
    default: mockedIsBrowser,
}));

describe('getDPR', () => {
    beforeEach(() => {
        mockedIsBrowser.mockReset();
        vi.unstubAllGlobals();
    });

    it('should return 1 when not running in browser', () => {
        mockedIsBrowser.mockReturnValue(false);

        expect(getDPR()).toBe(1);
    });

    it('should return window.devicePixelRatio in browser environment', () => {
        mockedIsBrowser.mockReturnValue(true);
        vi.stubGlobal('window', { devicePixelRatio: 2 });

        expect(getDPR()).toBe(2);
    });
});
