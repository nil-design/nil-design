import { Icon } from '@nild/icons';
import CheckSmall from '@nild/icons/CheckSmall';
import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { useCheckboxContext } from './contexts';
import { IndicatorProps } from './interfaces';
import {
    defaultIndicatorBlockClassNames,
    defaultIndicatorIconClassNames,
    indicatorClassNames,
    indicatorInputClassNames,
} from './style';

const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(({ className, children, ...restProps }, ref) => {
    const { variant, size, checked, setChecked } = useCheckboxContext();
    const renderBlock =
        children ??
        (checked => (
            <div className={defaultIndicatorBlockClassNames({ variant, checked })}>
                <Icon className={defaultIndicatorIconClassNames()} component={CheckSmall} />
            </div>
        ));

    return (
        <div {...restProps} className={cnMerge(indicatorClassNames({ size }), className)} ref={ref}>
            {renderBlock(!!checked)}
            <input type="checkbox" className={indicatorInputClassNames()} checked={checked} onChange={setChecked} />
        </div>
    );
});

Indicator.displayName = 'Checkbox.Indicator';

export default Indicator;
