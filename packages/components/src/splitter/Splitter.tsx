import { useControllableState, useEffectCallback, useEventListener } from '@nild/hooks';
import { Icon } from '@nild/icons';
import ArrowDown from '@nild/icons/ArrowDown';
import ArrowLeft from '@nild/icons/ArrowLeft';
import ArrowRight from '@nild/icons/ArrowRight';
import ArrowUp from '@nild/icons/ArrowUp';
import { cnMerge, mergeRefs } from '@nild/shared';
import {
    CSSProperties,
    Fragment,
    KeyboardEvent,
    MouseEvent as ReactMouseEvent,
    PointerEvent as ReactPointerEvent,
    ReactElement,
    Ref,
    RefAttributes,
    cloneElement,
    forwardRef,
    useMemo,
    useRef,
    useState,
} from 'react';
import { registerSlots } from '../_shared/utils';
import { SplitterGripProvider } from './contexts';
import Grip, { isGripElement } from './Grip';
import { GripProps, PanelProps, SplitterOrientation, SplitterProps } from './interfaces';
import { isPanelElement } from './Panel';
import variants from './style';

type PanelElement = ReactElement<PanelProps & RefAttributes<HTMLDivElement>> & { ref?: Ref<HTMLDivElement> };
type GripElement = ReactElement<GripProps & RefAttributes<HTMLSpanElement>> & { ref?: Ref<HTMLSpanElement> };

interface PanelMeta {
    key: string;
    el: PanelElement;
    props: PanelProps;
    min: number;
    max: number;
    defaultSize?: number;
}

interface ActiveResize {
    index: number;
    startCoordinate: number;
    startSizes: number[];
}

const DEFAULT_KEYBOARD_RESIZE_STEP = 5;
const PAGE_STEP_MULTIPLIER = 2;
const TOTAL_SIZE = 100;
const PRECISION = 4;

const collectSlots = registerSlots({
    panel: { isMatched: isPanelElement, multiple: true },
    grip: { isMatched: isGripElement },
});

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

const getPanelMin = (panel: PanelMeta) => (panel.props.collapsible ? 0 : panel.min);

const getPanelMax = (panel: PanelMeta) => panel.max;

const clampPanelSize = (value: number, panel: PanelMeta) => {
    return clamp(value, getPanelMin(panel), getPanelMax(panel));
};

const balanceSizes = (sizes: number[], panels: PanelMeta[]) => {
    const nextSizes = sizes.map((size, index) => clampPanelSize(isFiniteNumber(size) ? size : 0, panels[index]));
    let diff = TOTAL_SIZE - nextSizes.reduce((sum, size) => sum + size, 0);

    if (Math.abs(diff) < 1 / 10 ** PRECISION) {
        return nextSizes.map(roundSize);
    }

    const direction = diff > 0 ? 1 : -1;

    for (let pass = 0; pass < panels.length && Math.abs(diff) > 1 / 10 ** PRECISION; pass++) {
        for (let index = 0; index < panels.length && Math.abs(diff) > 1 / 10 ** PRECISION; index++) {
            const panel = panels[index];
            const capacity =
                direction > 0 ? getPanelMax(panel) - nextSizes[index] : nextSizes[index] - getPanelMin(panel);
            const delta = Math.min(Math.abs(diff), Math.max(capacity, 0));

            if (delta <= 0) {
                continue;
            }

            nextSizes[index] += delta * direction;
            diff -= delta * direction;
        }
    }

    return nextSizes.map(roundSize);
};

const getInitialSizes = (panels: PanelMeta[], providedSizes?: number[]) => {
    if (panels.length === 0) {
        return [];
    }

    const sizes = panels.map((panel, index) => {
        const providedSize = providedSizes?.[index];

        if (isFiniteNumber(providedSize)) {
            return providedSize;
        }

        return panel.defaultSize;
    });
    const fixedSize = sizes.reduce<number>((sum, size) => sum + (isFiniteNumber(size) ? size : 0), 0);
    const emptyCount = sizes.filter(size => !isFiniteNumber(size)).length;
    const fallbackSize = emptyCount > 0 ? Math.max(TOTAL_SIZE - fixedSize, 0) / emptyCount : 0;
    const normalizedSizes = sizes.map(size => (isFiniteNumber(size) ? size : fallbackSize));

    if (emptyCount === 0 && fixedSize > 0 && Math.abs(fixedSize - TOTAL_SIZE) > 1 / 10 ** PRECISION) {
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

const resizePair = (sizes: number[], panels: PanelMeta[], index: number, delta: number) => {
    const leftIndex = index;
    const rightIndex = index + 1;
    const leftSize = sizes[leftIndex];
    const rightSize = sizes[rightIndex];
    const leftPanel = panels[leftIndex];
    const rightPanel = panels[rightIndex];
    const minDelta = Math.max(getPanelMin(leftPanel) - leftSize, rightSize - getPanelMax(rightPanel));
    const maxDelta = Math.min(getPanelMax(leftPanel) - leftSize, rightSize - getPanelMin(rightPanel));
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

const getSeparatorOrientation = (orientation: SplitterOrientation) => {
    return orientation === 'vertical' ? 'horizontal' : 'vertical';
};

const getPanelStyle = (size: number, style?: CSSProperties): CSSProperties => ({
    ...style,
    flexBasis: `${size}%`,
    flexGrow: 0,
    flexShrink: 0,
});

const getResizerStyle = (sizes: number[], index: number, orientation: SplitterOrientation): CSSProperties => {
    const position = sizes.slice(0, index + 1).reduce((sum, size) => sum + size, 0);

    return orientation === 'vertical' ? { top: `${position}%` } : { left: `${position}%` };
};

/**
 * @category Components
 */
const Splitter = forwardRef<HTMLDivElement, SplitterProps>((props, ref) => {
    const {
        className,
        children,
        size: externalSize,
        defaultSize,
        orientation = 'horizontal',
        disabled = false,
        keyboardResizeStep = DEFAULT_KEYBOARD_RESIZE_STEP,
        resetOnDoubleClick = true,
        onResize,
        onResizeStart,
        onResizeEnd,
        onDoubleClick,
        onKeyDown,
        onPointerDown,
        ...restProps
    } = props;
    const splitterRef = useRef<HTMLDivElement | null>(null);
    const activeResizeRef = useRef<ActiveResize | null>(null);
    const restoreSizeRef = useRef<Record<number, number>>({});
    const [activeResizerIndex, setActiveResizerIndex] = useState<number | null>(null);
    const { slots } = useMemo(() => collectSlots(children), [children]);
    const gripEl = slots.grip.el as GripElement | null;
    const panels = useMemo<PanelMeta[]>(
        () =>
            (slots.panel.el as PanelElement[]).map((panelEl, index) => {
                const { min, max } = getPanelBounds(panelEl.props);

                return {
                    key: panelEl.key?.toString() ?? `${slots.panel.seq[index]}`,
                    el: panelEl,
                    props: panelEl.props,
                    min,
                    max,
                    defaultSize: panelEl.props.defaultSize,
                };
            }),
        [slots.panel.el, slots.panel.seq],
    );
    const initialSizes = useMemo(() => getInitialSizes(panels, defaultSize), [defaultSize, panels]);
    const [rawSizes, setRawSizes] = useControllableState<number[]>(externalSize, initialSizes);
    const sizes = useMemo(() => getInitialSizes(panels, rawSizes), [panels, rawSizes]);
    const keyboardStep = keyboardResizeStep > 0 ? keyboardResizeStep : DEFAULT_KEYBOARD_RESIZE_STEP;

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

    const isResizerDisabled = (index: number) => {
        return disabled || panels[index]?.props.resizable === false || panels[index + 1]?.props.resizable === false;
    };

    const handleRootPointerDown = useEffectCallback((evt: ReactPointerEvent<HTMLDivElement>) => {
        onPointerDown?.(evt);
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

    const resizeByKeyboard = useEffectCallback((index: number, delta: number, evt: KeyboardEvent<HTMLDivElement>) => {
        evt.preventDefault();
        const nextSizes = updateSizes(resizePair(sizes, panels, index, delta));

        onResizeEnd?.(nextSizes, index);
    });

    const handleResizerKeyDown = useEffectCallback((index: number, evt: KeyboardEvent<HTMLDivElement>) => {
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
                delta = getPanelMin(leftPanel) - leftSize;
                break;
            case 'End':
                delta = getPanelMax(leftPanel) - leftSize;
                break;
            default:
                break;
        }

        if (delta === undefined) {
            return;
        }

        resizeByKeyboard(index, delta, evt);
    });

    const toggleCollapse = useEffectCallback((handleIndex: number, panelIndex: number) => {
        const panelSize = sizes[panelIndex];
        const collapsed = panelSize <= getPanelMin(panels[panelIndex]) + 1 / 10 ** PRECISION;
        const restoreSize =
            restoreSizeRef.current[panelIndex] ?? panels[panelIndex].defaultSize ?? TOTAL_SIZE / panels.length;
        const targetSize = collapsed ? restoreSize : getPanelMin(panels[panelIndex]);
        const delta = panelIndex === handleIndex ? targetSize - panelSize : panelSize - targetSize;

        if (!collapsed) {
            restoreSizeRef.current[panelIndex] = panelSize;
        }

        const nextSizes = updateSizes(resizePair(sizes, panels, handleIndex, delta));

        onResizeEnd?.(nextSizes, handleIndex);
    });

    const resetSizes = useEffectCallback((index: number) => {
        const nextSizes = updateSizes(initialSizes);

        restoreSizeRef.current = {};
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

        resetSizes(index);
    });

    const ownerWindow = splitterRef.current?.ownerDocument.defaultView ?? null;
    const listenerTarget = activeResizerIndex === null ? null : ownerWindow;

    useEventListener(listenerTarget, 'pointermove', handlePointerMove);
    useEventListener(listenerTarget, 'pointerup', handleResizeEnd);
    useEventListener(listenerTarget, 'pointercancel', handleResizeEnd);

    const renderGrip = (active: boolean) => (
        <SplitterGripProvider value={{ orientation, active }}>{gripEl ?? <Grip />}</SplitterGripProvider>
    );

    const renderCollapseButton = (handleIndex: number, panelIndex: number) => {
        const panel = panels[panelIndex];

        if (!panel?.props.collapsible || isResizerDisabled(handleIndex)) {
            return null;
        }

        const collapsed = sizes[panelIndex] <= getPanelMin(panel) + 1 / 10 ** PRECISION;
        const beforePanel = panelIndex === handleIndex;
        const label = collapsed ? '展开面板' : '折叠面板';
        const icon =
            orientation === 'vertical' ? (beforePanel ? ArrowUp : ArrowDown) : beforePanel ? ArrowLeft : ArrowRight;

        return (
            <button
                aria-label={label}
                className={variants.collapseButton()}
                disabled={disabled}
                onClick={() => toggleCollapse(handleIndex, panelIndex)}
                onPointerDown={evt => evt.stopPropagation()}
                type="button"
            >
                <Icon component={icon} />
            </button>
        );
    };

    const renderResizer = (index: number) => {
        const resizerDisabled = isResizerDisabled(index);
        const active = activeResizerIndex === index;

        return (
            <div
                aria-controls={
                    [panels[index]?.props.id, panels[index + 1]?.props.id].filter(Boolean).join(' ') || undefined
                }
                aria-disabled={resizerDisabled}
                aria-orientation={getSeparatorOrientation(orientation)}
                aria-valuemax={getPanelMax(panels[index])}
                aria-valuemin={getPanelMin(panels[index])}
                aria-valuenow={roundSize(sizes[index])}
                aria-valuetext={`${roundSize(sizes[index])}%`}
                className={variants.resizer({ orientation, disabled: resizerDisabled, active })}
                data-disabled={resizerDisabled || undefined}
                key={`resizer-${panels[index].key}`}
                onDoubleClick={evt => handleResizerDoubleClick(index, evt)}
                onKeyDown={evt => handleResizerKeyDown(index, evt)}
                onPointerDown={evt => handleResizeStart(index, evt)}
                role="separator"
                style={getResizerStyle(sizes, index, orientation)}
                tabIndex={resizerDisabled ? -1 : 0}
            >
                {renderGrip(active)}
                <span className={variants.actions({ orientation })}>
                    {renderCollapseButton(index, index)}
                    {renderCollapseButton(index, index + 1)}
                </span>
            </div>
        );
    };

    if (panels.length === 0) {
        return (
            <div
                {...restProps}
                aria-disabled={disabled}
                className={cnMerge(variants.splitter({ orientation, disabled }), className)}
                data-disabled={disabled || undefined}
                onKeyDown={onKeyDown}
                onPointerDown={handleRootPointerDown}
                ref={mergeRefs(ref, splitterRef)}
            />
        );
    }

    return (
        <div
            {...restProps}
            aria-disabled={disabled}
            className={cnMerge(variants.splitter({ orientation, disabled }), className)}
            data-disabled={disabled || undefined}
            onKeyDown={onKeyDown}
            onPointerDown={handleRootPointerDown}
            ref={mergeRefs(ref, splitterRef)}
        >
            {panels.map((panel, index) => (
                <Fragment key={panel.key}>
                    {cloneElement<PanelProps & RefAttributes<HTMLDivElement>>(panel.el, {
                        ...panel.props,
                        'data-collapsed': sizes[index] <= getPanelMin(panel) + 1 / 10 ** PRECISION || undefined,
                        ref: panel.el.ref,
                        style: getPanelStyle(sizes[index], panel.props.style),
                    } as PanelProps & RefAttributes<HTMLDivElement>)}
                    {index < panels.length - 1 && renderResizer(index)}
                </Fragment>
            ))}
        </div>
    );
});

Splitter.displayName = 'Splitter';

export default Splitter;
