export enum GlobalStateKey {
    Modal = '@nild/components/modal-global-state',
}

type GlobalStateScope = typeof globalThis & Record<symbol, unknown>;

const getGlobalState = <State>(key: GlobalStateKey | string, createState: () => State): State => {
    const symbolKey = Symbol.for(key);
    const globalScope = globalThis as GlobalStateScope;

    if (!(symbolKey in globalScope)) {
        globalScope[symbolKey] = createState();
    }

    return globalScope[symbolKey] as State;
};

export default getGlobalState;
