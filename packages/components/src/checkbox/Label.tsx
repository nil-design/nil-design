import { cnMerge, isFunction } from '@nild/shared';
import { forwardRef } from 'react';
import { useCheckboxContext } from './contexts';
import { LabelProps } from './interfaces';
import { labelClassNames } from './style';

const Label = forwardRef<HTMLSpanElement, LabelProps>(
    ({ className, children: externalChildren, ...restProps }, ref) => {
        const { size, checked } = useCheckboxContext();
        const children = isFunction(externalChildren) ? externalChildren(!!checked) : externalChildren;

        return (
            <span {...restProps} className={cnMerge(labelClassNames({ size }), className)} ref={ref}>
                {children}
            </span>
        );
    },
);

Label.displayName = 'Checkbox.Label';

export default Label;
