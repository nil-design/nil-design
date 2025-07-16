import { cva } from '@nild/shared';
import { Status } from '../interfaces';

export const transitionClassNames = cva<{ status: Status }>(['transition-[opacity,visibility]'], {
    compoundVariants: [
        {
            status: Status.ENTERED,
            className: ['opacity-100', 'visible'],
        },
        {
            status: [Status.UNMOUNTED, Status.ENTERING, Status.EXITING, Status.EXITED],
            className: ['opacity-0', 'invisible'],
        },
    ],
});
