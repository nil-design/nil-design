import { IIconProps as ParkIconProps, Theme as ParkIconTheme, IconWrapper } from '@icon-park/react/es/runtime';
import { isFunction } from 'lodash-es';
import { ComponentType, FC, SVGProps, useState, useEffect } from 'react';
import { cn, kebabToPascal } from '../_core/utils';

type IconVariant = 'outlined' | 'filled' | 'two-tone' | 'multi-color';

export interface IconProps extends Omit<ParkIconProps, 'theme' | 'size'> {
    name?: string;
    variant?: IconVariant;
    component?: ComponentType<SVGProps<SVGSVGElement>>;
}

const iconImporters = import.meta.glob<false, string, ComponentType<unknown>>(
    '/node_modules/@icon-park/react/es/icons/*.js',
    {
        eager: false,
        import: 'default',
    },
);
const iconCaches = new Map<string, ComponentType<unknown>>();

const Icon: FC<IconProps> = ({ className, name = '', variant = 'outlined', component: Component, ...restProps }) => {
    const resolvedName = kebabToPascal(name);
    const resolvedTheme =
        (
            {
                outlined: 'outline',
            } as Record<IconVariant, ParkIconTheme>
        )[variant] ?? variant;
    const [DynamicIcon, setDynamicIcon] = useState<ComponentType<unknown> | null>(
        () => iconCaches.get(resolvedName) ?? null,
    );
    const importer = iconImporters[`/node_modules/@icon-park/react/es/icons/${resolvedName}.js`];

    useEffect(() => {
        if (iconCaches.has(resolvedName)) {
            setDynamicIcon(() => iconCaches.get(resolvedName) ?? null);
        } else if (!Component && isFunction(importer)) {
            importer().then(SvgIcon => {
                setDynamicIcon(() => {
                    iconCaches.set(resolvedName, SvgIcon);
                    return SvgIcon;
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Component, resolvedName]);

    const commonProps = {
        ...restProps,
        theme: resolvedTheme,
        className: cn('nd-icon', 'text-primary', 'text-[length:inherit]', className),
    };

    if (!Component) {
        if (!DynamicIcon) {
            const PlaceholderIcon = IconWrapper('placeholder-icon', false, ({ size }) => (
                <svg width={size} height={size}></svg>
            ));
            return <PlaceholderIcon {...commonProps} />;
        }
        return <DynamicIcon {...commonProps} />;
    }

    const LiteralIcon = IconWrapper('literal-icon', false, () => <Component />);
    return <LiteralIcon {...commonProps} />;
};

Icon.displayName = 'Icon';

export default Icon;
