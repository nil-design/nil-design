import { useCallback, useEffect, useRef } from 'react';

const AUTO_SCROLL_THRESHOLD = 48;

export const getScrollDistanceToBottom = element =>
    Math.max(0, element.scrollHeight - element.scrollTop - element.clientHeight);

export const isNearScrollBottom = (element, threshold = AUTO_SCROLL_THRESHOLD) =>
    getScrollDistanceToBottom(element) <= threshold;

export const useAutoScroll = ({ resetKey, watch, threshold = AUTO_SCROLL_THRESHOLD }) => {
    const scrollRef = useRef(null);
    const stickToBottomRef = useRef(true);
    const previousResetKeyRef = useRef(resetKey);

    const onScroll = useCallback(() => {
        if (!scrollRef.current) {
            return;
        }

        stickToBottomRef.current = isNearScrollBottom(scrollRef.current, threshold);
    }, [threshold]);

    useEffect(() => {
        const scrollElement = scrollRef.current;

        if (!scrollElement) {
            return;
        }

        if (previousResetKeyRef.current !== resetKey) {
            stickToBottomRef.current = true;
            previousResetKeyRef.current = resetKey;
        }

        if (stickToBottomRef.current) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }, [resetKey, threshold, watch]);

    return {
        onScroll,
        scrollRef,
    };
};
