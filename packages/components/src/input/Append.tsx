import { cnMerge, isString } from '@nild/shared';
import { Children, cloneElement, FC, isValidElement, ReactElement, ReactNode } from 'react';
import { useCompositeContext } from './contexts';
import { AppendProps } from './interfaces';
import variants from './style';

export const isAppendElement = (child: ReactNode): child is ReactElement<AppendProps> => {
    return isValidElement(child) && child.type === Append;
};

const Append: FC<AppendProps> = ({ children }) => {
    const { size, variant, disabled } = useCompositeContext();

    if (isString(children)) {
        return <span className={cnMerge(variants.append({ type: 'string', size, variant }))}>{children}</span>;
    }

    const child = Children.toArray(children).find(child => isValidElement(child));

    return cloneElement(child as ReactElement, {
        ...child?.props,
        className: cnMerge(
            variants.append({
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

Append.displayName = 'Input.Append';

export default Append;
