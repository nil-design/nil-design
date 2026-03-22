import { cva } from '@nild/shared';
import { TransitionStatus } from '../../transition/interfaces';
import { ModalPlacement, ModalSize, ModalVariant } from '../interfaces';

const HIDDEN_STATUSES: TransitionStatus[] = [
    TransitionStatus.UNMOUNTED,
    TransitionStatus.ENTERING,
    TransitionStatus.EXITING,
    TransitionStatus.EXITED,
];

const trigger = cva(['nd-modal-trigger']);

const portal = cva<{ placement: ModalPlacement }>(
    ['nd-modal-portal', 'fixed', 'inset-0', 'flex', 'pointer-events-auto'],
    {
        variants: {
            placement: {
                center: ['items-center', 'justify-center', 'p-4'],
                left: ['items-stretch', 'justify-start'],
                right: ['items-stretch', 'justify-end'],
                top: ['items-start', 'justify-center'],
                bottom: ['items-end', 'justify-center'],
            },
        },
    },
);

const overlay = cva([
    'nd-modal-overlay',
    'absolute',
    'inset-0',
    'transition-opacity',
    'duration-[var(--default-transition-duration)]',
    'ease-out',
    'bg-[color-mix(in_oklch,var(--background-color-page-inverse)_18%,transparent)]',
]);

const overlayMotion = cva<{ status: TransitionStatus }>([], {
    variants: {
        status: {
            [TransitionStatus.UNMOUNTED]: '',
            [TransitionStatus.ENTERING]: '',
            [TransitionStatus.ENTERED]: '',
            [TransitionStatus.EXITING]: '',
            [TransitionStatus.EXITED]: '',
        },
    },
    compoundVariants: [
        {
            status: HIDDEN_STATUSES,
            className: 'opacity-0',
        },
        {
            status: TransitionStatus.ENTERED,
            className: 'opacity-100',
        },
    ],
});

const header = cva(['nd-modal-header', 'shrink-0', 'px-6', 'pt-6', 'pb-4', 'pr-16', 'text-lg', 'font-semibold']);

const body = cva(['nd-modal-body', 'min-h-0', 'flex-auto', 'overflow-auto', 'px-6', 'pb-6']);

const footer = cva([
    'nd-modal-footer',
    'shrink-0',
    'flex',
    'justify-end',
    'gap-3',
    'border-t',
    'border-subtle',
    'px-6',
    'py-4',
]);

const close = cva(['nd-modal-close', 'absolute', 'top-4', 'right-6', 'z-1']);

const surface = cva<{ variant: ModalVariant; placement: ModalPlacement; size: ModalSize }>(
    [
        'nd-modal-surface',
        'relative',
        'pointer-events-auto',
        'flex',
        'min-h-0',
        'flex-col',
        'overflow-hidden',
        'bg-panel',
        'text-main',
        'shadow-2xl',
        'outline-none',
        'transition-[opacity,translate,scale]',
        'duration-[var(--default-transition-duration)]',
        'ease-out',
    ],
    {
        variants: {
            variant: {
                dialog: '',
                drawer: '',
            },
            placement: {
                center: ['w-full', 'max-h-[calc(100vh-2rem)]'],
                left: ['h-full', 'max-h-screen'],
                right: ['h-full', 'max-h-screen'],
                top: ['w-full', 'max-w-screen'],
                bottom: ['w-full', 'max-w-screen'],
            },
            size: {
                small: '',
                medium: '',
                large: '',
                full: '',
            },
        },
        compoundVariants: [
            {
                variant: 'dialog',
                placement: 'center',
                size: 'small',
                className: ['max-w-96', 'rounded-xl'],
            },
            {
                variant: 'dialog',
                placement: 'center',
                size: 'medium',
                className: ['max-w-[36rem]', 'rounded-xl'],
            },
            {
                variant: 'dialog',
                placement: 'center',
                size: 'large',
                className: ['max-w-[48rem]', 'rounded-xl'],
            },
            {
                variant: 'dialog',
                placement: 'center',
                size: 'full',
                className: ['h-[calc(100vh-2rem)]', 'w-[calc(100vw-2rem)]', 'max-w-none', 'rounded-xl'],
            },
            {
                variant: 'drawer',
                placement: ['left', 'right'],
                size: 'small',
                className: 'w-80',
            },
            {
                variant: 'drawer',
                placement: ['left', 'right'],
                size: 'medium',
                className: 'w-[28rem]',
            },
            {
                variant: 'drawer',
                placement: ['left', 'right'],
                size: 'large',
                className: 'w-[36rem]',
            },
            {
                variant: 'drawer',
                placement: ['left', 'right'],
                size: 'full',
                className: 'w-screen',
            },
            {
                variant: 'drawer',
                placement: ['top', 'bottom'],
                size: 'small',
                className: 'h-64',
            },
            {
                variant: 'drawer',
                placement: ['top', 'bottom'],
                size: 'medium',
                className: 'h-96',
            },
            {
                variant: 'drawer',
                placement: ['top', 'bottom'],
                size: 'large',
                className: 'h-[32rem]',
            },
            {
                variant: 'drawer',
                placement: ['top', 'bottom'],
                size: 'full',
                className: 'h-screen',
            },
        ],
    },
);

const surfaceMotion = cva<{
    status: TransitionStatus;
    variant: ModalVariant;
    placement: ModalPlacement;
}>([], {
    variants: {
        status: {
            [TransitionStatus.UNMOUNTED]: '',
            [TransitionStatus.ENTERING]: '',
            [TransitionStatus.ENTERED]: '',
            [TransitionStatus.EXITING]: '',
            [TransitionStatus.EXITED]: '',
        },
        variant: {
            dialog: '',
            drawer: '',
        },
        placement: {
            center: '',
            left: '',
            right: '',
            top: '',
            bottom: '',
        },
    },
    compoundVariants: [
        {
            status: HIDDEN_STATUSES,
            variant: 'dialog',
            className: ['opacity-0', 'scale-95'],
        },
        {
            status: TransitionStatus.ENTERED,
            variant: 'dialog',
            className: ['opacity-100', 'scale-100'],
        },
        {
            status: HIDDEN_STATUSES,
            variant: 'drawer',
            placement: 'left',
            className: '-translate-x-full',
        },
        {
            status: TransitionStatus.ENTERED,
            variant: 'drawer',
            placement: 'left',
            className: 'translate-x-0',
        },
        {
            status: HIDDEN_STATUSES,
            variant: 'drawer',
            placement: 'right',
            className: 'translate-x-full',
        },
        {
            status: TransitionStatus.ENTERED,
            variant: 'drawer',
            placement: 'right',
            className: 'translate-x-0',
        },
        {
            status: HIDDEN_STATUSES,
            variant: 'drawer',
            placement: 'top',
            className: '-translate-y-full',
        },
        {
            status: TransitionStatus.ENTERED,
            variant: 'drawer',
            placement: 'top',
            className: 'translate-y-0',
        },
        {
            status: HIDDEN_STATUSES,
            variant: 'drawer',
            placement: 'bottom',
            className: 'translate-y-full',
        },
        {
            status: TransitionStatus.ENTERED,
            variant: 'drawer',
            placement: 'bottom',
            className: 'translate-y-0',
        },
    ],
});

export default {
    trigger,
    portal,
    overlay,
    overlayMotion,
    surfaceMotion,
    header,
    body,
    footer,
    close,
    surface,
};
