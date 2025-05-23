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

const Icon: FC<IconProps> = ({ className, name: rawName = 'file-failed', component: Component, ...restProps }) => {
    const name = kebabToPascal(rawName);
    const [DynamicIcon, setDynamicIcon] = useState<ComponentType<unknown> | null>(null);
    const importer = iconImporters[`/node_modules/@icon-park/react/es/icons/${name}.js`];

    useEffect(() => {
        if (!Component && isFunction(importer)) {
            importer().then(SvgIcon => {
                setDynamicIcon(() => SvgIcon);
            });
        }
    }, [Component, importer]);

    const commonProps = {
        ...restProps,
        className: clsx('nd-icon', 'nd-text-primary', 'nd-text-[length:inherit]', className),
    };

    if (!Component) {
        if (!DynamicIcon) {
            return null;
        }
        return <DynamicIcon {...commonProps} />;
    }

    const LiteralIcon = IconWrapper('literal-icon', false, () => <Component />);
    return <LiteralIcon {...commonProps} />;
};

Icon.displayName = 'Icon';

export default Icon;
