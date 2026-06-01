import { cva } from '@nild/shared';
import type { AlertProps } from '../interfaces';

const alert = cva<Pick<AlertProps, 'type'>>(
    [
        'nd-alert',
        ['flex', 'w-full', 'items-start', 'gap-3'],
        ['rounded-md', 'border', 'px-4', 'py-3'],
        ['font-nd', 'text-md', 'text-main'],
    ],
    {
        variants: {
            type: {
                info: ['border-brand-muted', 'bg-brand-subtle'],
                success: ['border-success-muted', 'bg-success-subtle'],
                warning: ['border-warning-muted', 'bg-warning-subtle'],
                error: ['border-error-muted', 'bg-error-subtle'],
            },
        },
    },
);

const icon = cva<Pick<AlertProps, 'type'>>(
    ['nd-alert-icon', 'inline-flex', 'size-[1lh]', 'shrink-0', 'items-center', 'justify-center', 'leading-[inherit]'],
    {
        variants: {
            type: {
                info: 'text-brand',
                success: 'text-success',
                warning: 'text-warning',
                error: 'text-error',
            },
        },
    },
);

const content = cva<object>(['nd-alert-content', 'flex', 'min-w-0', 'flex-1', 'flex-col', 'gap-1']);

const title = cva<Pick<AlertProps, 'type'>>(['nd-alert-title', 'font-medium', 'leading-[inherit]'], {
    variants: {
        type: {
            info: 'text-brand',
            success: 'text-success',
            warning: 'text-warning',
            error: 'text-error',
        },
    },
});

const body = cva<object>(['nd-alert-body', 'text-muted', 'leading-[inherit]']);

const close = cva<object>(['nd-alert-close', '-mt-px', 'ms-1', 'shrink-0', 'text-muted', 'enabled:hover:text-main']);

export default { alert, icon, content, title, body, close };
