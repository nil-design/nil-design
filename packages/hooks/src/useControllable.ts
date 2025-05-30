import { isFunction, isUndefined } from 'lodash-es';
import { useState, Dispatch, SetStateAction, useCallback } from 'react';
import useUpdate from './useUpdate';

const useControllable = <T>(
    controlledValue: T | undefined,
    defaultValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] => {
    const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue);
    const forceUpdate = useUpdate();
    const dispatchUpdate = useCallback(
        (action: SetStateAction<T>) => {
            isFunction(action) && !isUndefined(controlledValue) && action(controlledValue);
            forceUpdate();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [controlledValue],
    );

    return !isUndefined(controlledValue)
        ? [controlledValue, dispatchUpdate]
        : [uncontrolledValue, setUncontrolledValue];
};

export default useControllable;
