import { useControllableState, useEffectCallback, useEventListener } from '@nild/hooks';
import { cnMerge, mergeRefs } from '@nild/shared';
import {
    CSSProperties,
    KeyboardEvent,
    PointerEvent as ReactPointerEvent,
    forwardRef,
    useMemo,
    useRef,
    useState,
} from 'react';
import { registerSlots } from '../_shared/utils';
import { SliderProvider } from './contexts';
import { SliderProps } from './interfaces';
import variants from './style';
import Thumb, { isThumbElement } from './Thumb';
import Track, { isTrackElement } from './Track';

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;
const PAGE_STEP_MULTIPLIER = 10;

const collectSlots = registerSlots({
    track: { isMatched: isTrackElement },
    thumb: { isMatched: isThumbElement },
});

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getPrecision = (value: number) => `${value}`.split('.')[1]?.length ?? 0;

const snapValue = (value: number, min: number, max: number, step: number, precision: number) => {
    const snapped = min + Math.round((value - min) / step) * step;

    return clamp(Number(snapped.toFixed(precision)), min, max);
};

const getPercent = (value: number, min: number, max: number) => {
    const range = max - min;

    return range <= 0 ? 0 : ((value - min) / range) * 100;
};

const getPointerValue = (
    evt: PointerEvent | ReactPointerEvent<HTMLDivElement>,
    $slider: HTMLDivElement,
    orientation: SliderProps['orientation'],
    min: number,
    max: number,
) => {
    const rect = $slider.getBoundingClientRect();
    const size = orientation === 'vertical' ? rect.height : rect.width;

    if (size <= 0) {
        return min;
    }

    const offset = orientation === 'vertical' ? rect.bottom - evt.clientY : evt.clientX - rect.left;
    const percent = clamp(offset / size, 0, 1);

    return min + (max - min) * percent;
};

/**
 * @category Components
 */
const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
    const {
        className,
        children,
        value: externalValue,
        defaultValue,
        min: externalMin = DEFAULT_MIN,
        max: externalMax = DEFAULT_MAX,
        step: externalStep = DEFAULT_STEP,
        orientation = 'horizontal',
        size = 'medium',
        variant = 'floating',
        block = false,
        disabled = false,
        onChange,
        onComplete,
        onKeyDown,
        onPointerDown,
        ...restProps
    } = props;
    const { slots } = useMemo(() => collectSlots(children), [children]);
    const min = Math.min(externalMin, externalMax);
    const max = Math.max(externalMin, externalMax);
    const step = externalStep > 0 ? externalStep : DEFAULT_STEP;
    const stepPrecision = Math.max(getPrecision(step), getPrecision(min));
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const [rawValue, setRawValue] = useControllableState<number>(externalValue, defaultValue ?? min);
    const value = snapValue(rawValue, min, max, step, stepPrecision);
    const percent = getPercent(value, min, max);

    const updateValue = useEffectCallback((nextValue: number) => {
        const nextSnappedValue = snapValue(nextValue, min, max, step, stepPrecision);

        if (Object.is(nextSnappedValue, value)) {
            return nextSnappedValue;
        }

        setRawValue(nextSnappedValue);
        onChange?.(nextSnappedValue);

        return nextSnappedValue;
    });

    const updateValueByPointer = useEffectCallback((evt: PointerEvent | ReactPointerEvent<HTMLDivElement>) => {
        const $slider = sliderRef.current;

        if (!$slider || disabled) {
            return value;
        }

        return updateValue(getPointerValue(evt, $slider, orientation, min, max));
    });

    const finishInteraction = useEffectCallback((nextValue = value) => {
        setDragging(false);
        onComplete?.(nextValue);
    });

    const handlePointerDown = useEffectCallback((evt: ReactPointerEvent<HTMLDivElement>) => {
        onPointerDown?.(evt);

        if (evt.defaultPrevented || disabled || (evt.button !== undefined && evt.button !== 0)) {
            return;
        }

        evt.preventDefault();
        evt.currentTarget.focus();
        evt.currentTarget.setPointerCapture?.(evt.pointerId);
        setDragging(true);
        updateValueByPointer(evt);
    });

    const handlePointerMove = useEffectCallback((evt: PointerEvent) => {
        if (!dragging) {
            return;
        }

        evt.preventDefault();
        updateValueByPointer(evt);
    });

    const handlePointerUp = useEffectCallback((evt: PointerEvent) => {
        if (!dragging) {
            return;
        }

        evt.preventDefault();
        finishInteraction(updateValueByPointer(evt));
    });

    const handleKeyDown = useEffectCallback((evt: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(evt);

        if (evt.defaultPrevented || disabled) {
            return;
        }

        let nextValue: number | undefined;

        switch (evt.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                nextValue = value + step;
                break;
            case 'ArrowLeft':
            case 'ArrowDown':
                nextValue = value - step;
                break;
            case 'PageUp':
                nextValue = value + step * PAGE_STEP_MULTIPLIER;
                break;
            case 'PageDown':
                nextValue = value - step * PAGE_STEP_MULTIPLIER;
                break;
            case 'Home':
                nextValue = min;
                break;
            case 'End':
                nextValue = max;
                break;
            default:
                break;
        }

        if (nextValue === undefined) {
            return;
        }

        evt.preventDefault();
        finishInteraction(updateValue(nextValue));
    });

    const ownerWindow = sliderRef.current?.ownerDocument.defaultView ?? null;
    const listenerTarget = dragging ? ownerWindow : null;

    useEventListener(listenerTarget, 'pointermove', handlePointerMove);
    useEventListener(listenerTarget, 'pointerup', handlePointerUp);
    useEventListener(listenerTarget, 'pointercancel', handlePointerUp);

    const rangeStyle = useMemo<CSSProperties>(
        () => (orientation === 'vertical' ? { height: `${percent}%` } : { width: `${percent}%` }),
        [orientation, percent],
    );
    const thumbStyle = useMemo<CSSProperties>(
        () => (orientation === 'vertical' ? { bottom: `${percent}%` } : { left: `${percent}%` }),
        [orientation, percent],
    );
    const contextValue = useMemo(
        () => ({ orientation, rangeStyle, size, thumbStyle, variant }),
        [orientation, rangeStyle, size, thumbStyle, variant],
    );

    return (
        <SliderProvider value={contextValue}>
            <div
                {...restProps}
                aria-disabled={disabled}
                aria-orientation={orientation}
                aria-valuemax={max}
                aria-valuemin={min}
                aria-valuenow={value}
                className={cnMerge(variants.slider({ orientation, size, variant, block, disabled }), className)}
                data-disabled={disabled || undefined}
                onKeyDown={handleKeyDown}
                onPointerDown={handlePointerDown}
                ref={mergeRefs(ref, sliderRef)}
                role="slider"
                tabIndex={disabled ? -1 : (restProps.tabIndex ?? 0)}
            >
                {slots.track.el ?? <Track />}
                {slots.thumb.el ?? <Thumb />}
            </div>
        </SliderProvider>
    );
});

Slider.displayName = 'Slider';

export default Slider;
