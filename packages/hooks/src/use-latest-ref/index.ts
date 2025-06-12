import { useMemo, useRef } from 'react';

const useLatestRef = <T>(value: T): { readonly current: T } => {
    const ref = useRef(value);
    ref.current = useMemo(() => value, [value]);

    return ref;
};

export default useLatestRef;
