import { cva } from '@nild/shared';

const actionButton = cva([
    'group inline-flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-sm p-0 leading-none text-muted',
    'transition-[color,box-shadow]',
    'hover:text-brand',
    'active:text-brand',
    'focus-visible:outline-none focus-visible:ring-focused',
]);

const iconStack = cva(['relative grid h-[1em] w-[1em] shrink-0 place-items-center leading-none [&_svg]:block']);

const copyIcon = cva(['absolute inset-0 block group-hover:hidden'], {
    variants: {
        hover: {
            true: 'hidden group-hover:block',
            false: '',
        },
    },
});

export default {
    actionButton,
    copyIcon,
    iconStack,
};
