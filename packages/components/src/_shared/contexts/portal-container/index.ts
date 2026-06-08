import { createContextSuite } from '@nild/shared';

export interface PortalContainerContextValue {
    container: HTMLElement | null;
}

const [PortalContainerProvider, usePortalContainerContext] = createContextSuite<PortalContainerContextValue>({
    defaultValue: {
        container: null,
    },
});

export { PortalContainerProvider, usePortalContainerContext };
