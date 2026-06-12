import { createContextSuite } from '@nild/shared';
import { CSSProperties } from 'react';
import { SliderOrientation, SliderSize, SliderVariant } from '../interfaces';

export interface SliderContextValue {
    orientation: SliderOrientation;
    size: SliderSize;
    variant: SliderVariant;
    rangeStyle: CSSProperties;
    thumbStyle: CSSProperties;
}

const [SliderProvider, useSliderContext] = createContextSuite<SliderContextValue>({
    defaultValue: {
        orientation: 'horizontal',
        size: 'medium',
        variant: 'floating',
        rangeStyle: { width: '0%' },
        thumbStyle: { left: '0%' },
    },
});

export { SliderProvider, useSliderContext };
