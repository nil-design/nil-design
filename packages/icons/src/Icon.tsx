import { IconWrapper, Theme as ParkIconTheme } from '@icon-park/react/es/runtime';
import { cnMerge } from '@nild/shared';
import { FC } from 'react';
import { iconClassNames } from './style';
import type { IconVariant, IconProps } from './interfaces';

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
        className: cnMerge(iconClassNames(), className),
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
