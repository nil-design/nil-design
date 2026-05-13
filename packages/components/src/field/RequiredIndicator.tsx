import { cnMerge } from '@nild/shared';
import { forwardRef, isValidElement, ReactElement, ReactNode } from 'react';
import { useFieldContext } from './contexts';
import variants from './style';
import type { RequiredIndicatorProps } from './interfaces';

const RequiredIndicator = forwardRef<HTMLSpanElement, RequiredIndicatorProps>(
    ({ className, children = '*', ...restProps }, ref) => {
        const { required } = useFieldContext();

        if (!required) {
            return null;
        }

        return (
            <span {...restProps} className={cnMerge(variants.requiredIndicator(), className)} ref={ref}>
                {children}
            </span>
        );
    },
);

RequiredIndicator.displayName = 'Field.RequiredIndicator';

export const isRequiredIndicatorElement = (child: ReactNode): child is ReactElement<RequiredIndicatorProps> => {
    return isValidElement(child) && child.type === RequiredIndicator;
};

export default RequiredIndicator;
