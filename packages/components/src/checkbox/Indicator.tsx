import { Icon } from '@nild/icons';
import CheckSmall from '@nild/icons/CheckSmall';
import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { useCheckboxContext } from './contexts';
import { IndicatorProps } from './interfaces';
import variants from './style';

const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(({ className, children, ...restProps }, ref) => {
    const { variant, size, checked, setChecked } = useCheckboxContext();
    const renderBlock =
        children ??
        (checked => (
            <div className={variants.defaultIndicatorBlock({ variant, checked })}>
                <Icon className={variants.defaultIndicatorIcon()} component={CheckSmall} />
            </div>
        ));

    return (
        <div {...restProps} className={cnMerge(variants.indicator({ size }), className)} ref={ref}>
            {renderBlock(!!checked)}
            <input type="checkbox" className={variants.indicatorInput()} checked={checked} onChange={setChecked} />
        </div>
    );
});

Indicator.displayName = 'Checkbox.Indicator';

export default Indicator;
