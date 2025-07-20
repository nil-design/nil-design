import { createContextSuite } from '@nild/shared';
import { SwitchProps } from '../interfaces';

const [SwitchProvider, useSwitchContext] = createContextSuite<Pick<SwitchProps, 'variant' | 'shape' | 'checked'>>({
    defaultValue: {},
});

export { SwitchProvider, useSwitchContext };
