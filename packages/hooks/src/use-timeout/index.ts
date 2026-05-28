import { isUndefined } from '@nild/shared';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import useLatestRef from '../use-latest-ref';

interface TimeoutControls {
    run: (delay?: number) => void;
    cancel: () => void;
}

const useTimeout = (callback: () => void, delay?: number): TimeoutControls => {
    const callbackRef = useLatestRef(callback);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const cancel = useCallback(() => {
        if (isUndefined(timerRef.current)) {
            return;
        }

        clearTimeout(timerRef.current);
        timerRef.current = undefined;
    }, []);

    const run = useCallback(
        (nextDelay?: number) => {
            const resolvedDelay = nextDelay ?? delay;

            cancel();

            if (isUndefined(resolvedDelay)) {
                return;
            }

            timerRef.current = setTimeout(() => {
                timerRef.current = undefined;
                callbackRef.current();
            }, resolvedDelay);
        },
        [callbackRef, cancel, delay],
    );

    useEffect(() => cancel, [cancel]);

    return useMemo(() => ({ run, cancel }), [cancel, run]);
};

export default useTimeout;
