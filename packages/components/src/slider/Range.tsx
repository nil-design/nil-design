import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { useSliderContext } from './contexts';
import { RangeProps } from './interfaces';
import variants from './style';

const Range = forwardRef<HTMLSpanElement, RangeProps>(({ className, style, ...restProps }, ref) => {
    const { orientation, rangeStyle, variant } = useSliderContext();

    return (
        <span
            {...restProps}
            className={cnMerge(variants.range({ orientation, variant }), className)}
            ref={ref}
            style={style ? { ...rangeStyle, ...style } : rangeStyle}
        />
    );
});

Range.displayName = 'Slider.Range';

export const isRangeElement = (child: ReactNode): child is ReactElement<RangeProps> =>
    isValidElement(child) && child.type === Range;

export default Range;
