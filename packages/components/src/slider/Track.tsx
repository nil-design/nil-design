import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { registerSlots } from '../_shared/utils';
import { useSliderContext } from './contexts';
import { TrackProps } from './interfaces';
import Range, { isRangeElement } from './Range';
import variants from './style';

const collectSlots = registerSlots({
    range: { isMatched: isRangeElement },
});

const Track = forwardRef<HTMLSpanElement, TrackProps>(({ className, children, ...restProps }, ref) => {
    const { orientation, variant } = useSliderContext();
    const { slots, restChildren } = collectSlots(children);

    return (
        <span
            {...restProps}
            aria-hidden="true"
            className={cnMerge(variants.track({ orientation, variant }), className)}
            ref={ref}
        >
            {slots.range.el ?? <Range />}
            {restChildren}
        </span>
    );
});

Track.displayName = 'Slider.Track';

export const isTrackElement = (child: ReactNode): child is ReactElement<TrackProps> =>
    isValidElement(child) && child.type === Track;

export default Track;
