import { useCallback, useState } from 'react';

const useForceUpdate = () => {
    const [, setState] = useState({});

    return useCallback(() => setState({}), []);
};

export default useForceUpdate;
