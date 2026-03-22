import { cva } from '@nild/shared';
import { TransitionStatus } from '../interfaces';

const transition = cva<{ status: TransitionStatus }>(['transition-[opacity,visibility]'], {
    compoundVariants: [
        {
            status: TransitionStatus.ENTERED,
            className: ['opacity-100', 'visible'],
        },
        {
            status: [
                TransitionStatus.UNMOUNTED,
                TransitionStatus.ENTERING,
                TransitionStatus.EXITING,
                TransitionStatus.EXITED,
            ],
            className: ['opacity-0', 'invisible'],
        },
    ],
});

export default { transition };
