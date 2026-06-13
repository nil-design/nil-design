import { useEffectCallback, useEventListener } from '@nild/hooks';
import {
    CSSProperties,
    KeyboardEvent,
    PointerEvent as ReactPointerEvent,
    RefObject,
    useMemo,
    useRef,
    useState,
} from 'react';
import { BLACK_COLOR, HslaColor, WHITE_COLOR, getColorCss, getHueCss, normalizeColor } from '../_shared/color';
import type { CommitColor } from './useColorPickerState';

type AreaPointerEvent = PointerEvent | ReactPointerEvent<HTMLDivElement>;

interface UseColorAreaOptions {
    color: HslaColor;
    disabled?: boolean;
    onCommitColor: CommitColor;
}

export interface ColorAreaController {
    areaLightnessStyle: CSSProperties;
    areaRef: RefObject<HTMLDivElement>;
    areaSaturationStyle: CSSProperties;
    areaStyle: CSSProperties;
    areaThumbStyle: CSSProperties;
    onKeyDown: (evt: KeyboardEvent<HTMLDivElement>) => void;
    onPointerDown: (evt: ReactPointerEvent<HTMLDivElement>) => void;
}

const getPointerColor = (evt: AreaPointerEvent, $area: HTMLDivElement, color: HslaColor) => {
    const rect = $area.getBoundingClientRect();
    const x = rect.width <= 0 ? 0 : (evt.clientX - rect.left) / rect.width;
    const y = rect.height <= 0 ? 0 : (evt.clientY - rect.top) / rect.height;

    return normalizeColor({
        ...color,
        s: x,
        l: 1 - y,
    });
};

const AREA_LIGHTNESS_STYLE: CSSProperties = {
    backgroundImage: `linear-gradient(to bottom, ${WHITE_COLOR}, transparent 50%, ${BLACK_COLOR})`,
};

const AREA_SATURATION_STYLE: CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${WHITE_COLOR}, transparent)`,
};

const useColorArea = ({ color, disabled = false, onCommitColor }: UseColorAreaOptions): ColorAreaController => {
    const areaRef = useRef<HTMLDivElement | null>(null);
    const [draggingArea, setDraggingArea] = useState(false);

    const updateAreaFromPointer = useEffectCallback((evt: AreaPointerEvent) => {
        const $area = areaRef.current;

        if (!$area || disabled) {
            return color;
        }

        const nextColor = getPointerColor(evt, $area, color);

        onCommitColor(nextColor);

        return nextColor;
    });

    const handleAreaPointerDown = useEffectCallback((evt: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled || (evt.button !== undefined && evt.button !== 0)) {
            return;
        }

        evt.preventDefault();
        evt.currentTarget.focus();
        evt.currentTarget.setPointerCapture?.(evt.pointerId);
        setDraggingArea(true);
        updateAreaFromPointer(evt);
    });

    const handleAreaPointerMove = useEffectCallback((evt: PointerEvent) => {
        if (!draggingArea) {
            return;
        }

        evt.preventDefault();
        updateAreaFromPointer(evt);
    });

    const handleAreaPointerUp = useEffectCallback((evt: PointerEvent) => {
        if (!draggingArea) {
            return;
        }

        evt.preventDefault();
        updateAreaFromPointer(evt);
        setDraggingArea(false);
    });

    const handleAreaKeyDown = useEffectCallback((evt: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
            return;
        }

        const movement = evt.shiftKey ? 0.1 : 0.01;
        let nextColor: HslaColor | undefined;

        switch (evt.key) {
            case 'ArrowRight':
                nextColor = { ...color, s: color.s + movement };
                break;
            case 'ArrowLeft':
                nextColor = { ...color, s: color.s - movement };
                break;
            case 'ArrowUp':
                nextColor = { ...color, l: color.l + movement };
                break;
            case 'ArrowDown':
                nextColor = { ...color, l: color.l - movement };
                break;
            case 'Home':
                nextColor = { ...color, s: 0 };
                break;
            case 'End':
                nextColor = { ...color, s: 1 };
                break;
            default:
                break;
        }

        if (!nextColor) {
            return;
        }

        evt.preventDefault();
        onCommitColor(normalizeColor(nextColor));
    });

    const areaStyle = useMemo<CSSProperties>(
        () => ({
            backgroundColor: getHueCss(color.h),
        }),
        [color.h],
    );
    const areaThumbStyle = useMemo<CSSProperties>(
        () => ({
            backgroundColor: getColorCss(color),
            left: `${color.s * 100}%`,
            top: `${(1 - color.l) * 100}%`,
        }),
        [color],
    );

    const ownerWindow = areaRef.current?.ownerDocument.defaultView ?? null;
    const areaListenerTarget = draggingArea ? ownerWindow : null;

    useEventListener(areaListenerTarget, 'pointermove', handleAreaPointerMove);
    useEventListener(areaListenerTarget, 'pointerup', handleAreaPointerUp);
    useEventListener(areaListenerTarget, 'pointercancel', handleAreaPointerUp);

    return {
        areaLightnessStyle: AREA_LIGHTNESS_STYLE,
        areaRef,
        areaSaturationStyle: AREA_SATURATION_STYLE,
        areaStyle,
        areaThumbStyle,
        onKeyDown: handleAreaKeyDown,
        onPointerDown: handleAreaPointerDown,
    };
};

export default useColorArea;
