import { cva } from '@nild/shared';
import { Status } from '../interfaces';

const transition = cva<{ status: Status }>(['transition-[opacity,visibility]'], {
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

export default { transition };
