import { IIconProps as ParkIconProps, IconWrapper } from '@icon-park/react/es/runtime';
import clsx from 'clsx';
import { isFunction } from 'lodash-es';
import { ComponentType, FC, SVGProps, useState, useEffect } from 'react';
import { kebabToPascal } from '../_core/utils';

export interface IconProps extends ParkIconProps {
    name?: string;
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

const Icon: FC<IconProps> = ({ className, name: rawName = 'file-failed', component: Component, ...restProps }) => {
    const name = kebabToPascal(rawName);
    const [DynamicIcon, setDynamicIcon] = useState<ComponentType<unknown> | null>(() => iconCaches.get(name) ?? null);
    const importer = iconImporters[`/node_modules/@icon-park/react/es/icons/${name}.js`];

    useEffect(() => {
        if (!Component && !DynamicIcon && isFunction(importer)) {
            importer().then(SvgIcon => {
                setDynamicIcon(() => {
                    iconCaches.set(name, SvgIcon);
                    return SvgIcon;
                });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Component, name]);

    const commonProps = {
        ...restProps,
        className: clsx('nd-icon', 'nd-text-primary', 'nd-text-[length:inherit]', className),
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
