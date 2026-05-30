// @vitest-environment jsdom

import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getScrollDistanceToBottom, isNearScrollBottom, useAutoScroll } from '../hooks/useAutoScroll';

const createScrollElement = ({ clientHeight = 200, scrollHeight = 500, scrollTop = 300 } = {}) => ({
    clientHeight,
    scrollHeight,
    scrollTop,
});

describe('assistant auto scroll', () => {
    it('detects whether the user is still near the bottom', () => {
        expect(getScrollDistanceToBottom(createScrollElement({ scrollTop: 240 }))).toBe(60);
        expect(isNearScrollBottom(createScrollElement({ scrollTop: 252 }))).toBe(true);
        expect(isNearScrollBottom(createScrollElement({ scrollTop: 240 }))).toBe(false);
    });

    it('keeps following streamed content while near the bottom', () => {
        const element = createScrollElement({ scrollTop: 260 });
        const { rerender, result } = renderHook(({ resetKey, watch }) => useAutoScroll({ resetKey, watch }), {
            initialProps: { resetKey: 1, watch: 1 },
        });

        result.current.scrollRef.current = element;
        result.current.onScroll();
        rerender({ resetKey: 1, watch: 2 });

        expect(element.scrollTop).toBe(element.scrollHeight);
    });

    it('pauses following when the user scrolls upward and resumes on a new message pair', () => {
        const element = createScrollElement({ scrollTop: 100 });
        const { rerender, result } = renderHook(({ resetKey, watch }) => useAutoScroll({ resetKey, watch }), {
            initialProps: { resetKey: 1, watch: 1 },
        });

        result.current.scrollRef.current = element;
        result.current.onScroll();
        rerender({ resetKey: 1, watch: 2 });

        expect(element.scrollTop).toBe(100);

        rerender({ resetKey: 2, watch: 3 });

        expect(element.scrollTop).toBe(element.scrollHeight);
    });
});
