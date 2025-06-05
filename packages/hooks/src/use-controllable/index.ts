import { isFunction, isUndefined } from '@nild/shared/utils';
import { useState, Dispatch, SetStateAction, useCallback } from 'react';
import useForceUpdate from '../use-force-update';

const useControllable = <T>(
    controlledValue: T | undefined,
    defaultValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] => {
    const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue);
    const forceUpdate = useForceUpdate();
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
