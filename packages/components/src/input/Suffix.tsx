import { cnMerge } from '@nild/shared';
import { forwardRef, isValidElement, ReactElement, ReactNode } from 'react';
import { useInputContext } from './contexts';
import { SuffixProps } from './interfaces';
import variants from './style';

export const isSuffixElement = (child: ReactNode): child is ReactElement<SuffixProps> => {
    return isValidElement(child) && child.type === Suffix;
};

const Suffix = forwardRef<HTMLSpanElement, SuffixProps>((props, ref) => {
    const { size } = useInputContext();
    const { className, children, ...restProps } = props;

    return (
        <span
            {...restProps}
            className={cnMerge(
                variants.suffix({
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

Suffix.displayName = 'Input.Suffix';

export default Suffix;
