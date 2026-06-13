import { CSSProperties } from 'react';
import Slider from '../slider';
import variants from './style';

interface SliderControlProps {
    label: string;
    max: number;
    min: number;
    step: number;
    trackClassName: string;
    value: number;
    disabled?: boolean;
    style?: CSSProperties;
    trackStyle?: CSSProperties;
    thumbStyle?: CSSProperties;
    onChange: (value: number) => void;
}

const SliderControl = ({
    disabled = false,
    label,
    max,
    min,
    onChange,
    step,
    style,
    trackClassName,
    trackStyle,
    thumbStyle,
    value,
}: SliderControlProps) => (
    <div className={variants.controlRow()} style={style}>
        <Slider
            aria-label={label}
            block
            className={variants.controlSlider()}
            disabled={disabled}
            max={max}
            min={min}
            size="medium"
            step={step}
            value={value}
            variant="contained"
            onChange={onChange}
        >
            <Slider.Track className={trackClassName} style={trackStyle}>
                <Slider.Range className={variants.transparentRange()} />
            </Slider.Track>
            <Slider.Thumb className={variants.controlThumb()} style={thumbStyle} />
        </Slider>
    </div>
);

SliderControl.displayName = 'ColorPicker.SliderControl';

export default SliderControl;
