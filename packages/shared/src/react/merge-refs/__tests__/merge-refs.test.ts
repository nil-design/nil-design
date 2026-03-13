import { describe, expect, it, vi } from 'vitest';
import mergeRefs from '../index';

describe('mergeRefs', () => {
    it('should write node to callback refs and object refs', () => {
        const callbackRef = vi.fn();
        const objectRef = { current: null as HTMLDivElement | null };
        const node = {} as HTMLDivElement;
        const merged = mergeRefs<HTMLDivElement>(callbackRef, objectRef);

        merged(node);

        expect(callbackRef).toHaveBeenCalledWith(node);
        expect(objectRef.current).toBe(node);
    });

    it('should return a cleanup callback composed from callback refs', () => {
        const clearA = vi.fn();
        const clearB = vi.fn();
        const callbackA = vi.fn(() => clearA);
        const callbackB = vi.fn(() => clearB);
        const merged = mergeRefs<HTMLDivElement>(callbackA, callbackB);
        const cleanup = (merged as unknown as (node: HTMLDivElement | null) => void | VoidFunction)(
            {} as HTMLDivElement,
        );

        expect(typeof cleanup).toBe('function');
        cleanup?.();
        expect(clearA).toHaveBeenCalledTimes(1);
        expect(clearB).toHaveBeenCalledTimes(1);
    });

    it('should ignore nullish refs', () => {
        const merged = mergeRefs<HTMLDivElement>(null, undefined);

        expect(() => merged(null)).not.toThrow();
    });
});
