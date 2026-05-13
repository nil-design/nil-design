import { cnMerge } from '@nild/shared';
import { forwardRef, isValidElement, ReactElement, ReactNode } from 'react';
import { useFieldContext } from './contexts';
import variants from './style';
import type { LabelProps } from './interfaces';

const Label = forwardRef<HTMLSpanElement, LabelProps>(({ className, children, ...restProps }, ref) => {
    const { disabled } = useFieldContext();

    return (
        <span {...restProps} className={cnMerge(variants.label({ disabled }), className)} ref={ref}>
            {children}
        </span>
    );
});

Label.displayName = 'Field.Label';

export const isLabelElement = (child: ReactNode): child is ReactElement<LabelProps> => {
    return isValidElement(child) && child.type === Label;
};

export default Label;
