import { isFunction, isUndefined } from '@nild/shared';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import useLatestRef from '../use-latest-ref';

interface RafControls {
    run: () => void;
    cancel: () => void;
}

const useRaf = (callback: FrameRequestCallback): RafControls => {
    const callbackRef = useLatestRef(callback);
    const frameRef = useRef<number>();

    const cancel = useCallback(() => {
        const cancelFrame = globalThis.cancelAnimationFrame;

        if (isUndefined(frameRef.current) || !isFunction(cancelFrame)) {
            return;
        }

        cancelFrame(frameRef.current);
        frameRef.current = undefined;
    }, []);

    const run = useCallback(() => {
        const requestFrame = globalThis.requestAnimationFrame;

        if (!isFunction(requestFrame)) {
            return;
        }

        cancel();
        frameRef.current = requestFrame(timestamp => {
            frameRef.current = undefined;
            callbackRef.current(timestamp);
        });
    }, [callbackRef, cancel]);

    useEffect(() => cancel, [cancel]);

    return useMemo(() => ({ run, cancel }), [cancel, run]);
};

export default useRaf;
