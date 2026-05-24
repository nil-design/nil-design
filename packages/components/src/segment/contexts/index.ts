import { createContextSuite } from '@nild/shared';
import { SegmentProps } from '../interfaces';

const [SegmentProvider, useSegmentContext] = createContextSuite<
    Pick<SegmentProps, 'size' | 'orientation' | 'block'> & { selected?: boolean }
>({
    defaultValue: {},
});

export { SegmentProvider, useSegmentContext };
