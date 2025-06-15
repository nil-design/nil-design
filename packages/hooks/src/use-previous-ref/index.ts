import { useMemo, useRef } from 'react';

const usePreviousRef = <T>(value: T) => {
    const previousRef = useRef<T | undefined>(undefined);
    const latestRef = useRef<T | undefined>(undefined);

    previousRef.current = latestRef.current;
    latestRef.current = useMemo(() => value, [value]);

    return previousRef;
};

export default usePreviousRef;
