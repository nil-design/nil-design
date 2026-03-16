import { describe, expect, it, vi } from 'vitest';
import mergeHandlers from '..';

describe('mergeHandlers', () => {
    it('runs handlers from left to right', () => {
        const calls: string[] = [];
        const handler = mergeHandlers(
            () => calls.push('first'),
            () => calls.push('second'),
        );

        handler();

        expect(calls).toEqual(['first', 'second']);
    });

    it('stops after preventDefault is called on an event-like argument', () => {
        const nextHandler = vi.fn();
        const handler = mergeHandlers((event: { defaultPrevented: boolean; preventDefault: () => void }) => {
            event.preventDefault();
        }, nextHandler);
        const event = {
            defaultPrevented: false,
            preventDefault() {
                this.defaultPrevented = true;
            },
        };

        handler(event);

        expect(nextHandler).not.toHaveBeenCalled();
    });

    it('runs all handlers for non event-like arguments', () => {
        const calls: number[] = [];
        const handler = mergeHandlers(
            (value: number) => calls.push(value),
            (value: number) => calls.push(value * 2),
        );

        handler(2);

        expect(calls).toEqual([2, 4]);
    });

    it('skips undefined handlers safely', () => {
        const handler = mergeHandlers<[string]>(undefined, value => value.toUpperCase());

        expect(() => handler('safe')).not.toThrow();
    });
});
