import { ReactNode } from 'react';

export enum TransitionStatus {
    UNMOUNTED = 'unmounted',
    ENTERING = 'entering',
    ENTERED = 'entered',
    EXITING = 'exiting',
    EXITED = 'exited',
}

export interface TransitionProps {
    className?: string;
    children?: ReactNode | ((status: TransitionStatus) => ReactNode);
    visible?: boolean;
}
