import { describe, expect, it, vi } from 'vitest';
import mergeProps from '..';

describe('mergeProps', () => {
    it('lets next props override normal fields', () => {
        const merged = mergeProps({ role: 'presentation', tabIndex: 0 }, { role: 'switch' });

        expect(merged.role).toBe('switch');
        expect(merged.tabIndex).toBe(0);
    });

    it('merges className with next props first', () => {
        const merged = mergeProps({ className: 'user-class' }, { className: 'internal-class' });

        expect(merged.className).toBe('internal-class user-class');
    });

    it('merges style objects with base props taking precedence', () => {
        const merged = mergeProps(
            { style: { opacity: 1, fontSize: '12px' } },
            { style: { opacity: 0.5, display: 'block' } },
        );

        expect(merged.style).toEqual({
            display: 'block',
            fontSize: '12px',
            opacity: 1,
        });
    });

    it('automatically merges event handlers', () => {
        const calls: string[] = [];
        const merged = mergeProps(
            {
                onClick: () => calls.push('base'),
            },
            {
                onClick: () => calls.push('next'),
            },
        );

        merged.onClick?.();

        expect(calls).toEqual(['base', 'next']);
    });

    it('merges multiple event props independently', () => {
        const onClickBase = vi.fn();
        const onClickNext = vi.fn();
        const onFocusBase = vi.fn();
        const onFocusNext = vi.fn();
        const merged = mergeProps(
            {
                onClick: onClickBase,
                onFocus: onFocusBase,
            },
            {
                onClick: onClickNext,
                onFocus: onFocusNext,
            },
        );

        merged.onClick?.();
        merged.onFocus?.();

        expect(onClickBase).toHaveBeenCalledTimes(1);
        expect(onClickNext).toHaveBeenCalledTimes(1);
        expect(onFocusBase).toHaveBeenCalledTimes(1);
        expect(onFocusNext).toHaveBeenCalledTimes(1);
    });
});
