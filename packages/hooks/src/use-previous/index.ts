import { useRef } from 'react';

const usePrevious = <T>(value: T, shouldUpdate: (a: T, b: T) => boolean = (a, b) => !Object.is(a, b)) => {
    const previousRef = useRef<T | undefined>(undefined);
    const currentRef = useRef<T>(value);

    if (shouldUpdate(currentRef.current, value)) {
        previousRef.current = currentRef.current;
        currentRef.current = value;
    }

    return previousRef.current;
};

export default usePrevious;
