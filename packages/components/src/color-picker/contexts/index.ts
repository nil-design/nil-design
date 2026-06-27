import { createContextSuite } from '@nild/shared';
import { KeyboardEvent, Ref, RefObject } from 'react';

interface ColorPickerTriggerContextValue {
    disabled: boolean;
    onKeyDown: (evt: KeyboardEvent<HTMLElement>) => void;
    open: boolean;
    rootRef: Ref<HTMLElement>;
    triggerRef: RefObject<HTMLElement | null>;
}

const [ColorPickerTriggerProvider, useColorPickerTriggerContext] = createContextSuite<ColorPickerTriggerContextValue>({
    defaultValue: {
        disabled: false,
        onKeyDown: () => {},
        open: false,
        rootRef: null,
        triggerRef: { current: null },
    },
});

export { ColorPickerTriggerProvider, useColorPickerTriggerContext };
