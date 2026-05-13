import { cnMerge } from '@nild/shared';
import { forwardRef, isValidElement, ReactElement, ReactNode } from 'react';
import variants from './style';
import type { HelperProps } from './interfaces';

const Helper = forwardRef<HTMLDivElement, HelperProps>(({ className, children, ...restProps }, ref) => {
    return (
        <div {...restProps} className={cnMerge(variants.helper(), className)} ref={ref}>
            {children}
        </div>
    );
});

Helper.displayName = 'Field.Helper';

export const isHelperElement = (child: ReactNode): child is ReactElement<HelperProps> => {
    return isValidElement(child) && child.type === Helper;
};

export default Helper;
