import { useEffect } from 'react';
import useLatestRef from '../use-latest-ref';

const useUnmount = (onUnmount?: () => void) => {
    const onUnmountRef = useLatestRef(onUnmount);

    useEffect(
        () => () => {
            onUnmountRef.current?.();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
};

export default useUnmount;
