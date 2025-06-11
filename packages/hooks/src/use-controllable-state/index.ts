import { isFunction, isUndefined } from '@nild/shared/utils';
import { useState, Dispatch, SetStateAction, useCallback } from 'react';
import useForceUpdate from '../use-force-update';

const useControllableState = <T>(
    controlledState: T | undefined,
    defaultValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] => {
    const [uncontrolledState, setUncontrolledState] = useState<T>(defaultValue);
    const forceUpdate = useForceUpdate();
    const dispatchUpdate = useCallback(
        (action: SetStateAction<T>) => {
            isFunction(action) && !isUndefined(controlledState) && action(controlledState);
            forceUpdate();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [controlledState],
    );

    return !isUndefined(controlledState)
        ? [controlledState, dispatchUpdate]
        : [uncontrolledState, setUncontrolledState];
};

export default useControllableState;
