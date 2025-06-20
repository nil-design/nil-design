import {
    IconWrapper,
    IIconProps as ParkIconProps,
    Theme as ParkIconTheme,
    StrokeLinecap,
    StrokeLinejoin,
} from '@icon-park/react/es/runtime';
import { cnMerge } from '@nild/shared';
import { HTMLAttributes, FC } from 'react';
import { IconVariant } from './_shared/interfaces';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
    component?: FC<ParkIconProps>;
    variant?: IconVariant;
    strokeWidth?: number;
    strokeLinecap?: StrokeLinecap;
    strokeLinejoin?: StrokeLinejoin;
    fill?: string | string[];
    spin?: boolean;
}

/**
 * @category Components
 */
const Icon: FC<IconProps> = ({ component: Component, className, variant = 'outlined', ...restProps }) => {
    const resolvedTheme =
        (
            {
                outlined: 'outline',
            } as Record<IconVariant, ParkIconTheme>
        )[variant] ?? variant;
    const commonProps = {
        ...restProps,
        theme: resolvedTheme,
        className: cnMerge('nd-icon', 'text-primary text-[length:inherit]', className),
    };

    if (!Component) {
        const PlaceholderIcon = IconWrapper('placeholder-icon', false, ({ size }) => (
            <svg width={size} height={size}></svg>
        ));

        return <PlaceholderIcon {...commonProps} />;
    }

    return <Component {...commonProps} />;
};

export default Icon;
