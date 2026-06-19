import { useControllableState, useEffectCallback, useEventListener } from '@nild/hooks';
import {
    CSSProperties,
    KeyboardEvent as ReactKeyboardEvent,
    MouseEvent as ReactMouseEvent,
    PointerEvent as ReactPointerEvent,
    ReactElement,
    Ref,
    RefAttributes,
    RefObject,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { PanelProps, SplitterOrientation, SplitterProps } from '../interfaces';

export type SplitterPanelElement = ReactElement<PanelProps & RefAttributes<HTMLDivElement>> & {
    ref?: Ref<HTMLDivElement>;
};

interface SplitterPanelMeta {
    key: string;
    el: SplitterPanelElement;
    props: PanelProps;
    min: number;
    max: number;
}

interface ActiveResize {
    index: number;
    startCoordinate: number;
    startSizes: number[];
}

interface UseSplitterResizeOptions {
    defaultSize?: number[];
    disabled: boolean;
    keyboardResizeStep?: number;
    onDoubleClick?: SplitterProps['onDoubleClick'];
    onResize?: SplitterProps['onResize'];
    onResizeEnd?: SplitterProps['onResizeEnd'];
    onResizeStart?: SplitterProps['onResizeStart'];
    orientation: SplitterOrientation;
    panelElements: SplitterPanelElement[];
    panelSeq: number[];
    resetOnDoubleClick: boolean;
    size?: number[];
    splitterRef: RefObject<HTMLDivElement | null>;
}

interface UseSplitterResizeResult {
    activeResizerIndex: number | null;
    handleResizeStart: (index: number, evt: ReactPointerEvent<HTMLDivElement>) => void;
    handleResizerDoubleClick: (index: number, evt: ReactMouseEvent<HTMLDivElement>) => void;
    handleResizerKeyDown: (index: number, evt: ReactKeyboardEvent<HTMLDivElement>) => void;
    isResizerDisabled: (index: number) => boolean;
    panels: SplitterPanelMeta[];
    resizerStyles: CSSProperties[];
    sizes: number[];
}

const DEFAULT_KEYBOARD_RESIZE_STEP = 5;
const PAGE_STEP_MULTIPLIER = 2;
const TOTAL_SIZE = 100;
const PRECISION = 4;
const EPSILON = 1 / 10 ** PRECISION;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const roundSize = (value: number) => Number(value.toFixed(PRECISION));

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const getPanelBounds = (props: PanelProps) => {
    const rawMin = isFiniteNumber(props.min) ? props.min : 0;
    const rawMax = isFiniteNumber(props.max) ? props.max : TOTAL_SIZE;
    const min = clamp(Math.min(rawMin, rawMax), 0, TOTAL_SIZE);
    const max = clamp(Math.max(rawMin, rawMax), min, TOTAL_SIZE);

    return { min, max };
};

const clampPanelSize = (value: number, panel: SplitterPanelMeta) => clamp(value, panel.min, panel.max);

const balanceSizes = (sizes: number[], panels: SplitterPanelMeta[]) => {
    const nextSizes = sizes.map((size, index) => clampPanelSize(isFiniteNumber(size) ? size : 0, panels[index]));
    let diff = TOTAL_SIZE - nextSizes.reduce((sum, size) => sum + size, 0);

    if (Math.abs(diff) < EPSILON) {
        return nextSizes.map(roundSize);
    }

    const direction = diff > 0 ? 1 : -1;

    for (let index = 0; index < panels.length && Math.abs(diff) > EPSILON; index++) {
        const panel = panels[index];
        const capacity = direction > 0 ? panel.max - nextSizes[index] : nextSizes[index] - panel.min;
        const delta = Math.min(Math.abs(diff), Math.max(capacity, 0));

        if (delta <= 0) {
            continue;
        }

        nextSizes[index] += delta * direction;
        diff -= delta * direction;
    }

    return nextSizes.map(roundSize);
};

const getInitialSizes = (panels: SplitterPanelMeta[], providedSizes?: number[]) => {
    if (panels.length === 0) {
        return [];
    }

    const sizes = panels.map((panel, index) => {
        const providedSize = providedSizes?.[index];

        return isFiniteNumber(providedSize) ? providedSize : panel.props.defaultSize;
    });
    const fixedSize = sizes.reduce<number>((sum, size) => sum + (isFiniteNumber(size) ? size : 0), 0);
    const emptyCount = sizes.filter(size => !isFiniteNumber(size)).length;
    const fallbackSize = emptyCount > 0 ? Math.max(TOTAL_SIZE - fixedSize, 0) / emptyCount : 0;
    const normalizedSizes = sizes.map(size => (isFiniteNumber(size) ? size : fallbackSize));

    if (emptyCount === 0 && fixedSize > 0 && Math.abs(fixedSize - TOTAL_SIZE) > EPSILON) {
        return balanceSizes(
            normalizedSizes.map(size => (size / fixedSize) * TOTAL_SIZE),
            panels,
        );
    }

    return balanceSizes(normalizedSizes, panels);
};

const areSizesEqual = (prevSizes: number[], nextSizes: number[]) => {
    return (
        prevSizes.length === nextSizes.length &&
        prevSizes.every((size, index) => roundSize(size) === roundSize(nextSizes[index]))
    );
};

const resizePair = (sizes: number[], panels: SplitterPanelMeta[], index: number, delta: number) => {
    const leftIndex = index;
    const rightIndex = index + 1;
    const leftSize = sizes[leftIndex];
    const rightSize = sizes[rightIndex];
    const leftPanel = panels[leftIndex];
    const rightPanel = panels[rightIndex];
    const minDelta = Math.max(leftPanel.min - leftSize, rightSize - rightPanel.max);
    const maxDelta = Math.min(leftPanel.max - leftSize, rightSize - rightPanel.min);
    const nextDelta = clamp(delta, minDelta, maxDelta);
    const nextSizes = [...sizes];

    nextSizes[leftIndex] = roundSize(leftSize + nextDelta);
    nextSizes[rightIndex] = roundSize(rightSize - nextDelta);

    return nextSizes;
};

const getCoordinate = (evt: PointerEvent | ReactPointerEvent<HTMLDivElement>, orientation: SplitterOrientation) => {
    return orientation === 'vertical' ? evt.clientY : evt.clientX;
};

const getContainerSize = ($splitter: HTMLDivElement, orientation: SplitterOrientation) => {
    const rect = $splitter.getBoundingClientRect();

    return orientation === 'vertical' ? rect.height : rect.width;
};

const getPanels = (panelElements: SplitterPanelElement[], panelSeq: number[]) => {
    return panelElements.map((panelEl, index) => {
        const { min, max } = getPanelBounds(panelEl.props);

        return {
            key: panelEl.key?.toString() ?? `${panelSeq[index]}`,
            el: panelEl,
            props: panelEl.props,
            min,
            max,
        };
    });
};

const useSplitterResize = ({
    defaultSize,
    disabled,
    keyboardResizeStep,
    onDoubleClick,
    onResize,
    onResizeEnd,
    onResizeStart,
    orientation,
    panelElements,
    panelSeq,
    resetOnDoubleClick,
    size: externalSize,
    splitterRef,
}: UseSplitterResizeOptions): UseSplitterResizeResult => {
    const activeResizeRef = useRef<ActiveResize | null>(null);
    const [activeResizerIndex, setActiveResizerIndex] = useState<number | null>(null);
    const panels = useMemo(() => getPanels(panelElements, panelSeq), [panelElements, panelSeq]);
    const initialSizes = useMemo(() => getInitialSizes(panels, defaultSize), [defaultSize, panels]);
    const [rawSizes, setRawSizes] = useControllableState<number[]>(externalSize, initialSizes);
    const sizes = useMemo(() => getInitialSizes(panels, rawSizes), [panels, rawSizes]);
    const keyboardStep =
        keyboardResizeStep && keyboardResizeStep > 0 ? keyboardResizeStep : DEFAULT_KEYBOARD_RESIZE_STEP;
    const resizerStyles = useMemo<CSSProperties[]>(() => {
        let position = 0;

        return sizes.slice(0, -1).map(size => {
            position = roundSize(position + size);

            return orientation === 'vertical' ? { top: `${position}%` } : { left: `${position}%` };
        });
    }, [orientation, sizes]);

    const isResizerDisabled = (index: number) => {
        return disabled || panels[index]?.props.resizable === false || panels[index + 1]?.props.resizable === false;
    };

    const updateSizes = useEffectCallback((nextRawSizes: number[]) => {
        const nextSizes = balanceSizes(nextRawSizes, panels);

        if (areSizesEqual(sizes, nextSizes)) {
            return nextSizes;
        }

        setRawSizes(nextSizes);
        onResize?.(nextSizes);

        return nextSizes;
    });

    const getPointerSizes = useEffectCallback((evt: PointerEvent | ReactPointerEvent<HTMLDivElement>) => {
        const activeResize = activeResizeRef.current;
        const $splitter = splitterRef.current;

        if (!$splitter || !activeResize) {
            return sizes;
        }

        const containerSize = getContainerSize($splitter, orientation);

        if (containerSize <= 0) {
            return activeResize.startSizes;
        }

        const delta = ((getCoordinate(evt, orientation) - activeResize.startCoordinate) / containerSize) * TOTAL_SIZE;

        return resizePair(activeResize.startSizes, panels, activeResize.index, delta);
    });

    const handleResizeStart = useEffectCallback((index: number, evt: ReactPointerEvent<HTMLDivElement>) => {
        if (evt.defaultPrevented || isResizerDisabled(index) || (evt.button !== undefined && evt.button !== 0)) {
            return;
        }

        evt.preventDefault();
        evt.currentTarget.focus();
        evt.currentTarget.setPointerCapture?.(evt.pointerId);
        activeResizeRef.current = {
            index,
            startCoordinate: getCoordinate(evt, orientation),
            startSizes: sizes,
        };
        setActiveResizerIndex(index);
        onResizeStart?.(sizes, index);
    });

    const handlePointerMove = useEffectCallback((evt: PointerEvent) => {
        if (!activeResizeRef.current) {
            return;
        }

        evt.preventDefault();
        updateSizes(getPointerSizes(evt));
    });

    const handleResizeEnd = useEffectCallback((evt: PointerEvent) => {
        const activeResize = activeResizeRef.current;

        if (!activeResize) {
            return;
        }

        evt.preventDefault();
        const nextSizes = updateSizes(getPointerSizes(evt));

        activeResizeRef.current = null;
        setActiveResizerIndex(null);
        onResizeEnd?.(nextSizes, activeResize.index);
    });

    const resizeByDelta = useEffectCallback((index: number, delta: number) => {
        return updateSizes(resizePair(sizes, panels, index, delta));
    });

    const handleResizerKeyDown = useEffectCallback((index: number, evt: ReactKeyboardEvent<HTMLDivElement>) => {
        if (isResizerDisabled(index)) {
            return;
        }

        const leftSize = sizes[index];
        const leftPanel = panels[index];
        let delta: number | undefined;

        switch (evt.key) {
            case 'ArrowLeft':
                delta = orientation === 'horizontal' ? -keyboardStep : undefined;
                break;
            case 'ArrowRight':
                delta = orientation === 'horizontal' ? keyboardStep : undefined;
                break;
            case 'ArrowUp':
                delta = orientation === 'vertical' ? -keyboardStep : undefined;
                break;
            case 'ArrowDown':
                delta = orientation === 'vertical' ? keyboardStep : undefined;
                break;
            case 'PageDown':
                delta = -keyboardStep * PAGE_STEP_MULTIPLIER;
                break;
            case 'PageUp':
                delta = keyboardStep * PAGE_STEP_MULTIPLIER;
                break;
            case 'Home':
                delta = leftPanel.min - leftSize;
                break;
            case 'End':
                delta = leftPanel.max - leftSize;
                break;
            default:
                break;
        }

        if (delta === undefined) {
            return;
        }

        evt.preventDefault();
        const nextSizes = resizeByDelta(index, delta);

        onResizeEnd?.(nextSizes, index);
    });

    const handleResizerDoubleClick = useEffectCallback((index: number, evt: ReactMouseEvent<HTMLDivElement>) => {
        if (isResizerDisabled(index)) {
            return;
        }

        onDoubleClick?.(sizes, index, evt);

        if (evt.defaultPrevented || !resetOnDoubleClick) {
            return;
        }

        const nextSizes = updateSizes(initialSizes);

        onResizeEnd?.(nextSizes, index);
    });

    const ownerWindow = splitterRef.current?.ownerDocument.defaultView ?? null;
    const listenerTarget = activeResizerIndex === null ? null : ownerWindow;

    useEventListener(listenerTarget, 'pointermove', handlePointerMove);
    useEventListener(listenerTarget, 'pointerup', handleResizeEnd);
    useEventListener(listenerTarget, 'pointercancel', handleResizeEnd);

    return {
        activeResizerIndex,
        handleResizeStart,
        handleResizerDoubleClick,
        handleResizerKeyDown,
        isResizerDisabled,
        panels,
        resizerStyles,
        sizes,
    };
};

export default useSplitterResize;
