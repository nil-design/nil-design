import { createContext } from '@nild/shared';
import { CheckboxProps } from '../interfaces';

const [CheckboxProvider, useCheckboxContext] = createContext<
    Pick<CheckboxProps, 'variant' | 'size' | 'checked'> & { handleChange?: () => void }
>({
    defaultValue: {},
});

export { CheckboxProvider, useCheckboxContext };
