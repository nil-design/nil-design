import { useRef } from 'react';

/**
 * Provide a ref that always points to the latest value
 * @warning The ref.current is readonly, don't try to assign a new value to it. More details please refer to the pitfalls of useRef
 */
const useLatestRef = <T>(value: T): { readonly current: T } => {
    const ref = useRef(value);
    ref.current = value;

    return ref;
};

export default useLatestRef;
