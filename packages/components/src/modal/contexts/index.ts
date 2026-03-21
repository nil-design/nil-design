import { createContextSuite } from '@nild/shared';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { ModalAccessibility, ModalPlacement, ModalSize, ModalVariant } from '../interfaces';

export interface ModalContextValue {
    open: boolean;
    variant: ModalVariant;
    placement: ModalPlacement;
    size: ModalSize;
    disabled: boolean;
    closeOnEscape: boolean;
    closeOnOverlayClick: boolean;
    trapFocus: boolean;
    restoreFocus: boolean;
    lockScroll: boolean;
    accessibility: ModalAccessibility;
    refs: {
        trigger: RefObject<Element>;
        surface: RefObject<HTMLDivElement>;
        lastActiveEl: RefObject<HTMLElement | null>;
    };
    requestOpen: Dispatch<SetStateAction<boolean>>;
    close: () => void;
}

const [ModalProvider, useModalContext] = createContextSuite<ModalContextValue>({
    defaultValue: {
        open: false,
        variant: 'dialog',
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
            lastActiveEl: { current: null },
        },
        requestOpen: () => undefined,
        close: () => undefined,
    },
});

export { ModalProvider, useModalContext };
