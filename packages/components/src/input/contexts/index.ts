import { createContextSuite } from '@nild/shared';
import { CompositeProps, InputProps } from '../interfaces';

const [CompositeProvider, useCompositeContext] = createContextSuite<
    Pick<CompositeProps, 'variant' | 'size' | 'block' | 'disabled'>
>({
    defaultValue: {
        variant: 'outlined',
        size: 'medium',
        block: false,
        disabled: false,
    },
});

const [InputProvider, useInputContext] = createContextSuite<
    Pick<InputProps, 'variant' | 'size' | 'block' | 'disabled'>
>({
    defaultValue: {
        variant: 'outlined',
        size: 'medium',
        block: false,
        disabled: false,
    },
});

export { CompositeProvider, useCompositeContext, InputProvider, useInputContext };
