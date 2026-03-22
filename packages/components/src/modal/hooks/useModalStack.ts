import { useEffect, useRef, useSyncExternalStore } from 'react';
import { EMPTY_MODAL_STACK, getModalStackStore } from '../_shared/stack';

const BASE_MODAL_Z_INDEX = 40;

export const useModalStack = (ownerDocument: Document | null, present: boolean) => {
    const tokenRef = useRef(Symbol('modal'));
    const stackStore = ownerDocument ? getModalStackStore(ownerDocument) : null;

    useEffect(() => {
        if (!present || !stackStore) {
            return;
        }

        return stackStore.mount(tokenRef.current);
    }, [present, stackStore]);

    const stackSnapshot = useSyncExternalStore(
        listener => stackStore?.subscribe(listener) ?? (() => undefined),
        () => stackStore?.getSnapshot() ?? EMPTY_MODAL_STACK,
        () => EMPTY_MODAL_STACK,
    );
    const stackIndex = stackSnapshot.indexOf(tokenRef.current);
    const topmost = stackSnapshot.at(-1) === tokenRef.current;

    return {
        zIndex: BASE_MODAL_Z_INDEX + (stackIndex === -1 ? 0 : stackIndex),
        topmost,
    };
};
