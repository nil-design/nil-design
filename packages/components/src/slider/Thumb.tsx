import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { useSliderContext } from './contexts';
import { ThumbProps } from './interfaces';
import variants from './style';

const Thumb = forwardRef<HTMLSpanElement, ThumbProps>(({ className, children, style, ...restProps }, ref) => {
    const { orientation, size, thumbStyle, variant } = useSliderContext();

    return (
        <span
            {...restProps}
            aria-hidden="true"
            className={cnMerge(variants.thumb({ orientation, size, variant }), className)}
            ref={ref}
            style={style ? { ...thumbStyle, ...style } : thumbStyle}
        >
            {children}
        </span>
    );
});

Thumb.displayName = 'Slider.Thumb';

export const isThumbElement = (child: ReactNode): child is ReactElement<ThumbProps> =>
    isValidElement(child) && child.type === Thumb;

export default Thumb;
