import { cva } from '@nild/shared';
import { ModalPlacement, ModalSize } from '../interfaces';

const trigger = cva(['nd-modal-trigger']);

const viewport = cva<{ placement: ModalPlacement }>(
    ['nd-modal-viewport', 'fixed', 'inset-0', 'flex', 'pointer-events-auto'],
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

const overlay = cva<{ visible: boolean }>(
    [
        'nd-modal-overlay',
        'absolute',
        'inset-0',
        'transition-opacity',
        'duration-[var(--default-transition-duration)]',
        'ease-out',
        'bg-[color-mix(in_oklch,var(--background-color-page-inverse)_18%,transparent)]',
    ],
    {
        variants: {
            visible: {
                true: 'opacity-100',
                false: 'opacity-0',
            },
        },
    },
);

const header = cva(['nd-modal-header', 'shrink-0', 'px-6', 'pt-6', 'pb-4', 'text-lg', 'font-semibold']);

const closableHeader = cva(['pr-16']);

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

const close = cva(['nd-modal-close', 'absolute', 'top-4', 'right-4', 'z-1']);

const surface = cva<{ placement: ModalPlacement; size: ModalSize; visible: boolean }>(
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
        'transition-[opacity,transform]',
        'duration-[var(--default-transition-duration)]',
        'ease-out',
    ],
    {
        variants: {
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
            visible: {
                true: '',
                false: '',
            },
        },
        compoundVariants: [
            {
                placement: 'center',
                size: 'small',
                className: ['max-w-96', 'rounded-xl'],
            },
            {
                placement: 'center',
                size: 'medium',
                className: ['max-w-[36rem]', 'rounded-xl'],
            },
            {
                placement: 'center',
                size: 'large',
                className: ['max-w-[48rem]', 'rounded-xl'],
            },
            {
                placement: 'center',
                size: 'full',
                className: ['h-[calc(100vh-2rem)]', 'w-[calc(100vw-2rem)]', 'max-w-none', 'rounded-xl'],
            },
            {
                placement: ['left', 'right'],
                size: 'small',
                className: 'w-80',
            },
            {
                placement: ['left', 'right'],
                size: 'medium',
                className: 'w-[28rem]',
            },
            {
                placement: ['left', 'right'],
                size: 'large',
                className: 'w-[36rem]',
            },
            {
                placement: ['left', 'right'],
                size: 'full',
                className: 'w-screen rounded-none',
            },
            {
                placement: ['top', 'bottom'],
                size: 'small',
                className: 'h-64',
            },
            {
                placement: ['top', 'bottom'],
                size: 'medium',
                className: 'h-96',
            },
            {
                placement: ['top', 'bottom'],
                size: 'large',
                className: 'h-[32rem]',
            },
            {
                placement: ['top', 'bottom'],
                size: 'full',
                className: 'h-screen rounded-none',
            },
            {
                placement: 'left',
                size: ['small', 'medium', 'large'],
                className: 'rounded-r-xl',
            },
            {
                placement: 'right',
                size: ['small', 'medium', 'large'],
                className: 'rounded-l-xl',
            },
            {
                placement: 'top',
                size: ['small', 'medium', 'large'],
                className: 'rounded-b-xl',
            },
            {
                placement: 'bottom',
                size: ['small', 'medium', 'large'],
                className: 'rounded-t-xl',
            },
            {
                placement: 'center',
                visible: true,
                className: ['opacity-100', 'scale-100'],
            },
            {
                placement: 'center',
                visible: false,
                className: ['opacity-0', 'scale-95'],
            },
            {
                placement: 'left',
                visible: true,
                className: ['translate-x-0'],
            },
            {
                placement: 'left',
                visible: false,
                className: ['-translate-x-full'],
            },
            {
                placement: 'right',
                visible: true,
                className: ['translate-x-0'],
            },
            {
                placement: 'right',
                visible: false,
                className: ['translate-x-full'],
            },
            {
                placement: 'top',
                visible: true,
                className: ['translate-y-0'],
            },
            {
                placement: 'top',
                visible: false,
                className: ['-translate-y-full'],
            },
            {
                placement: 'bottom',
                visible: true,
                className: ['translate-y-0'],
            },
            {
                placement: 'bottom',
                visible: false,
                className: ['translate-y-full'],
            },
        ],
    },
);

export default { trigger, viewport, overlay, header, closableHeader, body, footer, close, surface };
