import { getGlobalState, GlobalStateKey } from '../../_shared/utils';

export const EMPTY_MODAL_STACK: readonly symbol[] = [];

export interface ModalStackStore {
    getSnapshot: () => readonly symbol[];
    mount: (token: symbol) => VoidFunction;
    subscribe: (listener: VoidFunction) => VoidFunction;
}

const createModalStackStore = (): ModalStackStore => {
    const stack: symbol[] = [];
    const listeners = new Set<VoidFunction>();
    let snapshot: readonly symbol[] = EMPTY_MODAL_STACK;

    const emit = () => {
        snapshot = [...stack];
        listeners.forEach(listener => {
            listener();
        });
    };

    return {
        getSnapshot: () => snapshot,
        mount: token => {
            if (!stack.includes(token)) {
                stack.push(token);
                emit();
            }

            return () => {
                const index = stack.indexOf(token);

                if (index === -1) {
                    return;
                }

                stack.splice(index, 1);
                emit();
            };
        },
        subscribe: listener => {
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        },
    };
};

export const getModalStackStore = (ownerDocument: Document) => {
    const modalStackStores = getGlobalState<WeakMap<Document, ModalStackStore>>(
        GlobalStateKey.Modal,
        () => new WeakMap(),
    );
    const existingStackStore = modalStackStores.get(ownerDocument);

    if (existingStackStore) {
        return existingStackStore;
    }

    const stackStore = createModalStackStore();

    modalStackStores.set(ownerDocument, stackStore);

    return stackStore;
};
