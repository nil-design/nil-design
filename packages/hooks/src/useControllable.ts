import { isUndefined } from 'lodash-es';
import { useState, Dispatch, SetStateAction } from 'react';
import useUpdate from './useUpdate';

const useControllable = <T>(controlledValue: T | undefined, defaultValue: T | (() => T)) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue);
    const forceUpdate = useUpdate();

    return !isUndefined(controlledValue)
        ? [controlledValue, forceUpdate as Dispatch<SetStateAction<T>>]
        : [uncontrolledValue, setUncontrolledValue];
};

export default useControllable;
