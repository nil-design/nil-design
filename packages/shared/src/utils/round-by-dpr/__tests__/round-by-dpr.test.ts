import { beforeEach, describe, expect, it, vi } from 'vitest';
import roundByDPR from '../index';

const { mockedGetDPR } = vi.hoisted(() => ({
    mockedGetDPR: vi.fn(),
}));

vi.mock('../../get-dpr', () => ({
    default: mockedGetDPR,
}));

describe('roundByDPR', () => {
    beforeEach(() => {
        mockedGetDPR.mockReset();
    });

    it('should round by DPR=1 as regular rounding', () => {
        mockedGetDPR.mockReturnValue(1);

        expect(roundByDPR(2.49)).toBe(2);
    });

    it('should round by custom DPR value', () => {
        mockedGetDPR.mockReturnValue(2);

        expect(roundByDPR(0.6)).toBe(0.5);
    });

    it('should support non-even DPR values', () => {
        mockedGetDPR.mockReturnValue(3);

        expect(roundByDPR(1.334)).toBeCloseTo(4 / 3, 10);
    });
});
