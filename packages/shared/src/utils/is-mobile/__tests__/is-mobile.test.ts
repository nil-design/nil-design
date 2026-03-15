import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import isMobile from '../index';

const { mockedIsBrowser } = vi.hoisted(() => ({
    mockedIsBrowser: vi.fn(),
}));

vi.mock('../../is-browser', () => ({
    default: mockedIsBrowser,
}));

const createMatchMedia = (queryMatches: Record<string, boolean> = {}) =>
    vi.fn((query: string) => ({
        matches: Boolean(queryMatches[query]),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));

describe('isMobile', () => {
    beforeEach(() => {
        mockedIsBrowser.mockReset();
        vi.unstubAllGlobals();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should return false when not running in browser', () => {
        mockedIsBrowser.mockReturnValue(false);

        expect(isMobile()).toBe(false);
    });

    it('should return true for mobile user agent', () => {
        mockedIsBrowser.mockReturnValue(true);
        vi.stubGlobal('window', {
            matchMedia: createMatchMedia(),
            innerWidth: 1280,
        });
        vi.stubGlobal('navigator', {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            platform: 'iPhone',
            maxTouchPoints: 5,
        });

        expect(isMobile()).toBe(true);
    });

    it('should return true for iPadOS desktop user agent', () => {
        mockedIsBrowser.mockReturnValue(true);
        vi.stubGlobal('window', {
            matchMedia: createMatchMedia(),
            innerWidth: 1366,
        });
        vi.stubGlobal('navigator', {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            platform: 'MacIntel',
            maxTouchPoints: 5,
        });

        expect(isMobile()).toBe(true);
    });

    it('should return true for coarse touch-only narrow viewport devices', () => {
        mockedIsBrowser.mockReturnValue(true);
        vi.stubGlobal('window', {
            matchMedia: createMatchMedia({
                '(pointer: coarse)': true,
                '(hover: none)': true,
                '(max-width: 1024px)': true,
            }),
            innerWidth: 900,
        });
        vi.stubGlobal('navigator', {
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
            platform: 'Linux x86_64',
            maxTouchPoints: 1,
        });

        expect(isMobile()).toBe(true);
    });

    it('should return false for desktop user agent and desktop input modes', () => {
        mockedIsBrowser.mockReturnValue(true);
        vi.stubGlobal('window', {
            matchMedia: createMatchMedia({
                '(pointer: coarse)': false,
                '(hover: none)': false,
                '(max-width: 1024px)': false,
            }),
            innerWidth: 1440,
        });
        vi.stubGlobal('navigator', {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            platform: 'Win32',
            maxTouchPoints: 0,
        });

        expect(isMobile()).toBe(false);
    });
});
