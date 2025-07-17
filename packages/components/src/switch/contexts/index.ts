import { createContext } from '@nild/shared';
import { SwitchProps } from '../interfaces';

const [SwitchProvider, useSwitchContext] = createContext<Pick<SwitchProps, 'variant' | 'shape' | 'checked'>>({
    defaultValue: {},
});

export { SwitchProvider, useSwitchContext };
