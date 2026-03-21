import { afterEach, describe, expect, it, vi } from 'vitest';
import { GlobalStateKey } from '../../../_shared/utils';

const resetModalGlobalState = () => {
    vi.resetModules();
    delete (globalThis as typeof globalThis & Record<symbol, unknown>)[Symbol.for(GlobalStateKey.Modal)];
};

describe('modal stack store', () => {
    afterEach(() => {
        resetModalGlobalState();
    });

    it('reuses the same store for the same document across module reloads', async () => {
        const { getModalStackStore } = await import('../stack');
        const firstStackStore = getModalStackStore(document);
        const token = Symbol('first-modal');

        firstStackStore.mount(token);
        expect(firstStackStore.getSnapshot()).toEqual([token]);

        vi.resetModules();

        const { getModalStackStore: getModalStackStoreFromReloadedModule } = await import('../stack');
        const secondStackStore = getModalStackStoreFromReloadedModule(document);

        expect(secondStackStore).toBe(firstStackStore);
        expect(secondStackStore.getSnapshot()).toEqual([token]);
    });

    it('keeps different documents isolated from each other', async () => {
        const { getModalStackStore } = await import('../stack');
        const firstStackStore = getModalStackStore(document);
        const secondDocument = document.implementation.createHTMLDocument('other');
        const secondStackStore = getModalStackStore(secondDocument);
        const firstToken = Symbol('first-modal');
        const secondToken = Symbol('second-modal');

        firstStackStore.mount(firstToken);
        secondStackStore.mount(secondToken);

        expect(secondStackStore).not.toBe(firstStackStore);
        expect(firstStackStore.getSnapshot()).toEqual([firstToken]);
        expect(secondStackStore.getSnapshot()).toEqual([secondToken]);
    });

    it('updates the snapshot when modals mount and unmount in order', async () => {
        const { getModalStackStore } = await import('../stack');
        const stackStore = getModalStackStore(document);
        const firstToken = Symbol('first-modal');
        const secondToken = Symbol('second-modal');

        const unmountFirst = stackStore.mount(firstToken);
        const unmountSecond = stackStore.mount(secondToken);

        expect(stackStore.getSnapshot()).toEqual([firstToken, secondToken]);

        unmountSecond();
        expect(stackStore.getSnapshot()).toEqual([firstToken]);

        unmountFirst();
        expect(stackStore.getSnapshot()).toEqual([]);
    });

    it('ignores duplicate mounts for the same token', async () => {
        const { getModalStackStore } = await import('../stack');
        const stackStore = getModalStackStore(document);
        const token = Symbol('first-modal');

        const unmountFirst = stackStore.mount(token);
        const unmountSecond = stackStore.mount(token);

        expect(stackStore.getSnapshot()).toEqual([token]);

        unmountFirst();
        expect(stackStore.getSnapshot()).toEqual([]);

        unmountSecond();
        expect(stackStore.getSnapshot()).toEqual([]);
    });

    it('notifies subscribers when the snapshot changes', async () => {
        const { getModalStackStore } = await import('../stack');
        const stackStore = getModalStackStore(document);
        const token = Symbol('first-modal');
        const snapshots: Array<readonly symbol[]> = [];
        const unsubscribe = stackStore.subscribe(() => {
            snapshots.push(stackStore.getSnapshot());
        });
        const unmount = stackStore.mount(token);

        unmount();
        unsubscribe();

        expect(snapshots).toEqual([[token], []]);
    });
});
