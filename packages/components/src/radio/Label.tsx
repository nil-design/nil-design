import { cnMerge, isFunction } from '@nild/shared';
import { forwardRef } from 'react';
import { useRadioContext } from './contexts';
import { LabelProps } from './interfaces';
import variants from './style';

const Label = forwardRef<HTMLSpanElement, LabelProps>(
    ({ className, children: externalChildren, ...restProps }, ref) => {
        const { size, checked } = useRadioContext();
        const children = isFunction(externalChildren) ? externalChildren(!!checked) : externalChildren;

        return (
            <span {...restProps} className={cnMerge(variants.label({ size }), className)} ref={ref}>
                {children}
            </span>
        );
    },
);

Label.displayName = 'Radio.Label';

export default Label;
