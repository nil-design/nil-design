import { createContextSuite } from '@nild/shared';
import { CSSProperties, Dispatch, RefObject, SetStateAction } from 'react';
import { ArrowOrientation, PopupProps, TriggerAction } from '../interfaces';
import type { Coords } from '@floating-ui/dom';

export interface PopupContextValue extends Pick<PopupProps, 'arrowed' | 'size'> {
    actions: Set<TriggerAction>;
    refs: {
        trigger: RefObject<Element>;
        portal: RefObject<HTMLDivElement>;
        arrow: RefObject<HTMLDivElement>;
    };
    setOpen: Dispatch<SetStateAction<boolean>>;
    enter: () => void;
    leave: () => void;
}

const [PopupProvider, usePopupContext] = createContextSuite<PopupContextValue>({
    defaultValue: {
        actions: new Set(),
        refs: {
            trigger: { current: null },
            portal: { current: null },
            arrow: { current: null },
        },
        setOpen: () => {},
        enter: () => {},
        leave: () => {},
    },
});

const [PortalProvider, usePortalContext] = createContextSuite<{
    coords: Coords;
}>({
    defaultValue: {
        coords: { x: 0, y: 0 },
    },
});

const [ArrowProvider, useArrowContext] = createContextSuite<{
    style: CSSProperties;
    orientation: ArrowOrientation;
}>({
    defaultValue: {
        style: {},
        orientation: 'up',
    },
});

export { PopupProvider, PortalProvider, ArrowProvider, usePopupContext, usePortalContext, useArrowContext };
