import { cva } from '@nild/shared';
import type { FieldStatus } from '../interfaces';

const field = cva<{ disabled?: boolean; status?: FieldStatus }>(
    ['nd-field', 'flex', 'flex-col', 'items-start', 'gap-1.5', 'font-nd', 'text-md'],
    {
        variants: {
            disabled: {
                true: ['disabled'],
                false: '',
            },
            status: {
                success: '',
                warning: '',
                error: '',
            },
        },
    },
);

const labelRow = cva<object>(['nd-field-label-row', 'inline-flex', 'items-center', 'gap-1.5']);

const label = cva<{ disabled?: boolean }>(['nd-field-label', 'text-main', 'font-medium'], {
    variants: {
        disabled: {
            true: ['opacity-60'],
            false: '',
        },
    },
});

const helper = cva<object>(['nd-field-helper', 'text-sm', 'text-subtle']);

const status = cva<{ status?: FieldStatus }>(['nd-field-status', 'text-sm'], {
    variants: {
        status: {
            success: ['text-success'],
            warning: ['text-warning'],
            error: ['text-error'],
        },
    },
});

const requiredIndicator = cva<object>(['nd-field-required-indicator', 'text-error']);

export default { field, labelRow, label, helper, status, requiredIndicator };
