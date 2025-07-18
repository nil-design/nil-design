import { createContextSuite } from '@nild/shared';
import { CheckboxProps } from '../interfaces';

const [CheckboxProvider, useCheckboxContext] = createContextSuite<
    Pick<CheckboxProps, 'variant' | 'size' | 'checked'> & { handleChange?: () => void }
>({
    defaultValue: {},
});

export { CheckboxProvider, useCheckboxContext };
