import { cva } from '@nild/shared';
import sharedStyles from '../../_shared/style';

const form = cva<object>(['nd-form', 'flex', 'flex-col', 'gap-4', 'font-nd', sharedStyles.disabled]);

const actions = cva<object>(['nd-form-actions', 'flex', 'items-center', 'justify-end', 'gap-3']);

export default { form, actions };
