import { cva } from '@nild/shared';

const watermark = cva<object>(['nd-watermark', 'relative', 'font-nd']);

const layer = cva<object>([
    'nd-watermark-layer',
    'pointer-events-none',
    'absolute',
    'inset-0',
    'bg-repeat',
    'text-subtle',
]);

export default { watermark, layer };
