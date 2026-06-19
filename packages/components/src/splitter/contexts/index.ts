import { createContextSuite } from '@nild/shared';
import { SplitterOrientation } from '../interfaces';

interface SplitterGripContextValue {
    orientation: SplitterOrientation;
    active: boolean;
}

const [SplitterGripProvider, useSplitterGripContext] = createContextSuite<SplitterGripContextValue>({
    defaultValue: {
        orientation: 'horizontal',
        active: false,
    },
});

export { SplitterGripProvider, useSplitterGripContext };
