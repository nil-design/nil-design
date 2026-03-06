import { cnMerge, isString } from '@nild/shared';
import { Children, cloneElement, FC, isValidElement, ReactElement, ReactNode } from 'react';
import { useCompositeContext } from './contexts';
import { PrependProps } from './interfaces';
import { prependClassNames } from './style';

export const isPrependElement = (child: ReactNode): child is ReactElement<PrependProps> => {
    return isValidElement(child) && child.type === Prepend;
};

const Prepend: FC<PrependProps> = ({ children }) => {
    const { size, variant, disabled } = useCompositeContext();

    if (isString(children)) {
        return <span className={cnMerge(prependClassNames({ type: 'string', size, variant }))}>{children}</span>;
    }

    const child = Children.toArray(children).find(child => isValidElement(child));

    return cloneElement(child as ReactElement, {
        ...child?.props,
        className: cnMerge(
            prependClassNames({
                type: 'element',
                size,
                variant,
            }),
            child?.props?.className,
        ),
        size,
        disabled,
    });
};

Prepend.displayName = 'Input.Prepend';

export default Prepend;
