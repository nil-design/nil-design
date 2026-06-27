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
import { BLACK_COLOR, HsvaColor, WHITE_COLOR, getHueCss, normalizeColor } from '../_shared/color';
import type { CommitColor } from './useColorPickerState';

type AreaPointerEvent = PointerEvent | ReactPointerEvent<HTMLDivElement>;

interface UseColorAreaOptions {
    color: HsvaColor;
    colorCss: string;
    disabled?: boolean;
    onCommitColor: CommitColor;
}

export interface ColorAreaController {
    areaRef: RefObject<HTMLDivElement>;
    areaSaturationStyle: CSSProperties;
    areaStyle: CSSProperties;
    areaThumbStyle: CSSProperties;
    areaValueStyle: CSSProperties;
    onKeyDown: (evt: KeyboardEvent<HTMLDivElement>) => void;
    onPointerDown: (evt: ReactPointerEvent<HTMLDivElement>) => void;
}

const getPointerColor = (evt: AreaPointerEvent, $area: HTMLDivElement, color: HsvaColor) => {
    const rect = $area.getBoundingClientRect();
    const x = rect.width <= 0 ? 0 : (evt.clientX - rect.left) / rect.width;
    const y = rect.height <= 0 ? 0 : (evt.clientY - rect.top) / rect.height;

    return normalizeColor({
        ...color,
        s: x,
        v: 1 - y,
    });
};

const AREA_VALUE_STYLE: CSSProperties = {
    backgroundImage: `linear-gradient(to top, ${BLACK_COLOR}, transparent)`,
};

const AREA_SATURATION_STYLE: CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${WHITE_COLOR}, transparent)`,
};

const useColorArea = ({
    color,
    colorCss,
    disabled = false,
    onCommitColor,
}: UseColorAreaOptions): ColorAreaController => {
    const areaRef = useRef<HTMLDivElement | null>(null);
    const [draggingArea, setDraggingArea] = useState(false);

    const updateAreaFromPointer = useEffectCallback((evt: AreaPointerEvent) => {
        const $area = areaRef.current;

        if (!$area || disabled) {
            return;
        }

        const nextColor = getPointerColor(evt, $area, color);

        onCommitColor(nextColor);
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
        let nextColor: HsvaColor | undefined;

        switch (evt.key) {
            case 'ArrowRight':
                nextColor = { ...color, s: color.s + movement };
                break;
            case 'ArrowLeft':
                nextColor = { ...color, s: color.s - movement };
                break;
            case 'ArrowUp':
                nextColor = { ...color, v: color.v + movement };
                break;
            case 'ArrowDown':
                nextColor = { ...color, v: color.v - movement };
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
            backgroundColor: colorCss,
            left: `${color.s * 100}%`,
            top: `${(1 - color.v) * 100}%`,
        }),
        [color.s, color.v, colorCss],
    );

    const ownerWindow = areaRef.current?.ownerDocument.defaultView ?? null;
    const areaListenerTarget = draggingArea ? ownerWindow : null;

    useEventListener(areaListenerTarget, 'pointermove', handleAreaPointerMove);
    useEventListener(areaListenerTarget, 'pointerup', handleAreaPointerUp);
    useEventListener(areaListenerTarget, 'pointercancel', handleAreaPointerUp);

    return {
        areaRef,
        areaSaturationStyle: AREA_SATURATION_STYLE,
        areaStyle,
        areaThumbStyle,
        areaValueStyle: AREA_VALUE_STYLE,
        onKeyDown: handleAreaKeyDown,
        onPointerDown: handleAreaPointerDown,
    };
};

export default useColorArea;
