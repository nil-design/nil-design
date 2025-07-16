import { ReactNode } from 'react';

export enum Status {
    UNMOUNTED = 'unmounted',
    ENTERING = 'entering',
    ENTERED = 'entered',
    EXITING = 'exiting',
    EXITED = 'exited',
}

export interface TransitionProps {
    className?: string;
    children?: ReactNode;
    visible?: boolean;
}
