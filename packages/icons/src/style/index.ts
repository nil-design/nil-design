import { cva } from '@nild/shared';
import type { IconProps } from '../interfaces';

export const iconClassNames = cva<IconProps>([
    'nd-icon',
    'text-[color:inherit] text-[length:inherit]',
    'transition-[color,fill,stroke]',
]);
