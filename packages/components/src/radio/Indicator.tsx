import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { useRadioContext } from './contexts';
import { IndicatorProps } from './interfaces';
import variants from './style';

const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(({ className, children, ...restProps }, ref) => {
    const { variant, size, checked, setChecked } = useRadioContext();

    const renderCircle =
        children ??
        ((checked: boolean) => (
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                    cx="10"
                    cy="10"
                    className={cnMerge(variants.defaultIndicatorOuterCircle({ variant, checked }))}
                />
                <circle cx="10" cy="10" className={variants.defaultIndicatorInnerCircle({ variant, checked })} />
            </svg>
        ));

    return (
        <div {...restProps} className={cnMerge(variants.indicator({ size }), className)} ref={ref}>
            {renderCircle(!!checked)}
            <input type="radio" className={variants.indicatorInput()} checked={checked} onChange={setChecked} />
        </div>
    );
});

Indicator.displayName = 'Radio.Indicator';

export default Indicator;
