import { cnMerge } from '@nild/shared';
import { forwardRef, isValidElement, ReactElement, ReactNode } from 'react';
import variants from './style';
import type { LabelProps } from './interfaces';

const Label = forwardRef<HTMLSpanElement, LabelProps>(({ className, children, ...restProps }, ref) => {
    return (
        <span {...restProps} className={cnMerge(variants.label(), className)} ref={ref}>
            {children}
        </span>
    );
});

Label.displayName = 'Field.Label';

export const isLabelElement = (child: ReactNode): child is ReactElement<LabelProps> => {
    return isValidElement(child) && child.type === Label;
};

export default Label;
