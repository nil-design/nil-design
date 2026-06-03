import { cnMerge, isNil } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { useAlertContext } from './contexts';
import { IconProps } from './interfaces';
import variants from './style';

export const isIconElement = (child: ReactNode): child is ReactElement<IconProps> => {
    return isValidElement(child) && child.type === Icon;
};

const Icon = forwardRef<HTMLSpanElement, IconProps>(({ className, children, ...restProps }, ref) => {
    const { type } = useAlertContext();

    if (isNil(children) || children === false) {
        return null;
    }

    return (
        <span {...restProps} aria-hidden="true" className={cnMerge(variants.icon({ type }), className)} ref={ref}>
            {children}
        </span>
    );
});

Icon.displayName = 'Alert.Icon';

export default Icon;
