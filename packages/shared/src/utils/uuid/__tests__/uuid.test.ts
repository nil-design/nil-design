import { afterEach, describe, expect, it, vi } from 'vitest';
import uuid from '../index';

describe('uuid', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should use crypto.randomUUID by default when available', () => {
        const randomUUID = vi.fn(() => 'mocked-random-uuid');

        vi.stubGlobal('crypto', { randomUUID });

        expect(uuid()).toBe('mocked-random-uuid');
        expect(randomUUID).toHaveBeenCalledTimes(1);
    });

    it('should fall back to RFC4122-like UUID format when crypto.randomUUID is unavailable', () => {
        vi.stubGlobal('crypto', undefined);

        expect(uuid()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should create custom-length ids with provided radix', () => {
        const id = uuid({ length: 10, radix: 2, standard: false });

        expect(id).toMatch(/^[01]{10}$/);
    });

    it('should fall back to radix 16 when radix is out of range', () => {
        const id = uuid({ length: 12, radix: 100, standard: false });

        expect(id).toMatch(/^[0-9a-f]{12}$/);
    });
});
