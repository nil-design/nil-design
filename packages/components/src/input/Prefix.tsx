import { cnMerge } from '@nild/shared';
import { forwardRef, isValidElement, ReactElement, ReactNode } from 'react';
import { useInputContext } from './contexts';
import { PrefixProps } from './interfaces';
import variants from './style';

export const isPrefixElement = (child: ReactNode): child is ReactElement<PrefixProps> => {
    return isValidElement(child) && child.type === Prefix;
};

const Prefix = forwardRef<HTMLSpanElement, PrefixProps>((props, ref) => {
    const { size } = useInputContext();
    const { className, children, ...restProps } = props;

    return (
        <span
            {...restProps}
            className={cnMerge(
                variants.prefix({
                    size,
                }),
                className,
            )}
            ref={ref}
        >
            {children}
        </span>
    );
});

Prefix.displayName = 'Input.Prefix';

export default Prefix;
