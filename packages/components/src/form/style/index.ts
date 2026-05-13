import { cva } from '@nild/shared';

const form = cva<{ disabled?: boolean }>(['nd-form', 'flex', 'flex-col', 'gap-4', 'font-nd'], {
    variants: {
        disabled: {
            true: ['disabled'],
            false: '',
        },
    },
});

const actions = cva<object>(['nd-form-actions', 'flex', 'items-center', 'justify-end', 'gap-3']);

export default { form, actions };
