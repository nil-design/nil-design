import { cva } from '@nild/shared';
import sharedStyles from '../../_shared/style';
import { ColorPickerSize } from '../interfaces';

const trigger = cva<{
    size?: ColorPickerSize;
    disabled?: boolean;
    open?: boolean;
}>(
    [
        'nd-color-picker-trigger',
        'inline-flex',
        'items-center',
        'justify-center',
        'box-border',
        'border',
        'border-main',
        'bg-transparent',
        'p-1',
        'outline-none',
        'transition-[border-color,box-shadow]',
        'enabled:hover:border-brand-hover',
        'enabled:focus-visible:ring-focused',
        sharedStyles.disabled,
    ],
    {
        variants: {
            size: {
                small: ['size-6', 'rounded-sm'],
                medium: ['size-8', 'rounded-md'],
                large: ['size-10', 'rounded-md'],
            },
            disabled: {
                true: '',
                false: 'cursor-pointer',
            },
            open: {
                true: ['border-brand', 'ring-focused'],
                false: '',
            },
        },
    },
);

const customTrigger = cva<{
    open?: boolean;
}>(['nd-color-picker-custom-trigger', 'outline-none', 'focus-visible:ring-focused', sharedStyles.disabled], {
    variants: {
        open: {
            true: ['ring-focused'],
            false: '',
        },
    },
});

const swatch = cva<object>([
    'nd-color-picker-swatch',
    'relative',
    'block',
    'size-full',
    'box-border',
    'overflow-hidden',
    'rounded-sm',
]);

const swatchColor = cva<object>(['nd-color-picker-swatch-color', 'absolute', 'inset-0']);

const panel = cva<object>(['nd-color-picker-panel', 'w-64', 'p-3', 'font-nd', 'text-main', 'outline-none']);

const stack = cva<object>(['flex', 'flex-col', 'gap-3']);

const area = cva<{
    disabled?: boolean;
}>(
    [
        'nd-color-picker-area',
        'relative',
        'h-36',
        'w-full',
        'overflow-hidden',
        'rounded-md',
        'border',
        'border-subtle',
        'outline-none',
        'touch-none',
        'select-none',
        'focus-visible:ring-focused',
        sharedStyles.disabled,
    ],
    {
        variants: {
            disabled: {
                true: '',
                false: 'cursor-crosshair',
            },
        },
    },
);

const areaLayer = cva<object>(['absolute', 'inset-0', 'pointer-events-none']);

const areaThumb = cva<object>([
    'nd-color-picker-area-thumb',
    'absolute',
    'size-3',
    '-translate-x-1/2',
    '-translate-y-1/2',
    'rounded-full',
    'border-2',
    'border-canvas',
    'shadow-md',
    'pointer-events-none',
]);

const sliderPreviewRow = cva<object>(['flex', 'items-stretch', 'gap-4']);

const sliderStack = cva<object>(['flex', 'h-9', 'min-w-0', 'flex-auto', 'flex-col', 'justify-between']);

const controlRow = cva<object>(['flex', 'h-3', 'items-center']);

const controlSlider = cva<object>(['h-3', 'min-w-0', 'flex-auto']);

const controlThumb = cva<object>(['group-enabled:group-hover:![box-shadow:var(--tw-shadow,0_0_#00000000)]']);

const previewSwatch = cva<object>([
    'nd-color-picker-preview',
    'block',
    'size-9',
    'shrink-0',
    'overflow-hidden',
    'rounded-md',
    'border',
    'border-main',
]);

const hueTrack = cva<object>(['h-3', 'bg-[linear-gradient(to_right,red,yellow,lime,cyan,blue,magenta,red)]']);

const alphaTrack = cva<object>(['h-3', 'border border-main']);

const transparentRange = cva<object>(['bg-transparent']);

const inputStack = cva<object>(['flex', 'flex-col', 'gap-3']);

const formatSegment = cva<object>(['w-full']);

const valueInput = cva<{
    invalid?: boolean;
}>(['w-full'], {
    variants: {
        invalid: {
            true: ['border-error', 'enabled:focus-within:border-error'],
            false: '',
        },
    },
});

const presets = cva<object>(['grid', 'grid-cols-8', 'gap-1.5']);

const preset = cva<object>([
    'nd-color-picker-preset',
    'relative',
    'size-5',
    'overflow-hidden',
    'rounded-sm',
    'p-0',
    'outline-none',
    'transition-[box-shadow]',
    'focus-visible:ring-focused',
    'enabled:hover:shadow-md',
]);

const presetCheck = cva<object>([
    'nd-color-picker-preset-check',
    'absolute',
    'inset-0',
    'z-10',
    'grid',
    'place-items-center',
    'pointer-events-none',
    'leading-none',
]);

const presetCheckIcon = cva<object>([
    'inline-flex',
    'items-center',
    'justify-center',
    'text-base',
    'leading-none',
    '[&_svg]:block',
]);

export default {
    trigger,
    customTrigger,
    swatch,
    swatchColor,
    panel,
    stack,
    area,
    areaLayer,
    areaThumb,
    sliderPreviewRow,
    sliderStack,
    controlRow,
    controlSlider,
    controlThumb,
    previewSwatch,
    hueTrack,
    alphaTrack,
    transparentRange,
    inputStack,
    formatSegment,
    valueInput,
    presets,
    preset,
    presetCheck,
    presetCheckIcon,
};
