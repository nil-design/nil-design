import { isFunction } from '@nild/shared';
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useRef, useState } from 'react';

const resolveState = <T>(state: T | (() => T)): T => {
    return isFunction(state) ? (state as () => T)() : state;
};

const useRefState = <T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] => {
    const initialStateRef = useRef<{ value: T }>();

    if (!initialStateRef.current) {
        initialStateRef.current = { value: resolveState(initialState) };
    }

    const [state, setState] = useState<T>(initialStateRef.current.value);
    const stateRef = useRef(state);

    const setRefState = useCallback<Dispatch<SetStateAction<T>>>(action => {
        const nextState = isFunction(action) ? (action as (prevState: T) => T)(stateRef.current) : action;

        stateRef.current = nextState;
        setState(nextState);
    }, []);

    return [state, setRefState, stateRef];
};

export default useRefState;
