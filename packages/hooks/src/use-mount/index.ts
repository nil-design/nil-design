import { useEffect } from 'react';

const useMount = (onMount?: () => void) => {
    useEffect(() => {
        onMount?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export default useMount;
