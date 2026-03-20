import { createContextSuite } from '@nild/shared';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { ModalPlacement, ModalProps, ModalSize } from '../interfaces';

export interface ModalContextValue {
    id: number;
    open: boolean;
    placement: ModalPlacement;
    size: ModalSize;
    disabled: boolean;
    closeOnEscape: boolean;
    closeOnOverlayClick: boolean;
    trapFocus: boolean;
    restoreFocus: boolean;
    lockScroll: boolean;
    accessibility: Pick<ModalProps, 'aria-label' | 'aria-labelledby' | 'aria-describedby'>;
    refs: {
        trigger: RefObject<Element>;
        surface: RefObject<HTMLDivElement>;
    };
    requestOpen: Dispatch<SetStateAction<boolean>>;
    close: () => void;
}

const [ModalProvider, useModalContext] = createContextSuite<ModalContextValue>({
    defaultValue: {
        id: 0,
        open: false,
        placement: 'center',
        size: 'medium',
        disabled: false,
        closeOnEscape: true,
        closeOnOverlayClick: true,
        trapFocus: true,
        restoreFocus: true,
        lockScroll: true,
        accessibility: {
            'aria-label': undefined,
            'aria-labelledby': undefined,
            'aria-describedby': undefined,
        },
        refs: {
            trigger: { current: null },
            surface: { current: null },
        },
        requestOpen: () => undefined,
        close: () => undefined,
    },
});

export { ModalProvider, useModalContext };
