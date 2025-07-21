import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { useRadioContext } from './contexts';
import { IndicatorProps } from './interfaces';
import {
    indicatorClassNames,
    indicatorInputClassNames,
    defaultIndicatorOuterCircleClassNames,
    defaultIndicatorInnerCircleClassNames,
} from './style';

const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(({ className, children, ...restProps }, ref) => {
    const { variant, size, checked, setChecked } = useRadioContext();

    const renderCircle =
        children ??
        ((checked: boolean) => (
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" className={defaultIndicatorOuterCircleClassNames({ variant, checked })} />
                <circle cx="10" cy="10" className={defaultIndicatorInnerCircleClassNames({ variant, checked })} />
            </svg>
        ));

    return (
        <div {...restProps} className={cnMerge(indicatorClassNames({ size }), className)} ref={ref}>
            {renderCircle(!!checked)}
            <input type="radio" className={indicatorInputClassNames()} checked={checked} onChange={setChecked} />
        </div>
    );
});

Indicator.displayName = 'Radio.Indicator';

export default Indicator;
