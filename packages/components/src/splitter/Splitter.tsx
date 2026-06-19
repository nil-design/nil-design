import { cnMerge, mergeRefs } from '@nild/shared';
import { CSSProperties, Fragment, ReactElement, cloneElement, forwardRef, useMemo, useRef } from 'react';
import { registerSlots } from '../_shared/utils';
import { SplitterGripProvider } from './contexts';
import Grip, { isGripElement } from './Grip';
import useSplitterResize, { type SplitterPanelElement } from './hooks/useSplitterResize';
import { isPanelElement } from './Panel';
import variants from './style';
import type { GripProps, SplitterProps } from './interfaces';

type GripElement = ReactElement<GripProps>;

const collectSlots = registerSlots({
    panel: { isMatched: isPanelElement, multiple: true },
    grip: { isMatched: isGripElement },
});

const getPanelStyle = (size: number, style?: CSSProperties): CSSProperties => ({
    ...style,
    flexBasis: `${size}%`,
    flexGrow: 0,
    flexShrink: 0,
});

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
        keyboardResizeStep,
        resetOnDoubleClick = true,
        onResize,
        onResizeStart,
        onResizeEnd,
        onDoubleClick,
        ...restProps
    } = props;
    const splitterRef = useRef<HTMLDivElement | null>(null);
    const { slots } = useMemo(() => collectSlots(children), [children]);
    const gripEl = slots.grip.el as GripElement | null;
    const {
        activeResizerIndex,
        handleResizeStart,
        handleResizerDoubleClick,
        handleResizerKeyDown,
        isResizerDisabled,
        panels,
        resizerStyles,
        sizes,
    } = useSplitterResize({
        defaultSize,
        disabled,
        keyboardResizeStep,
        onDoubleClick,
        onResize,
        onResizeEnd,
        onResizeStart,
        orientation,
        panelElements: slots.panel.el as SplitterPanelElement[],
        panelSeq: slots.panel.seq,
        resetOnDoubleClick,
        size: externalSize,
        splitterRef,
    });
    const separatorOrientation = orientation === 'vertical' ? 'horizontal' : 'vertical';

    const renderGrip = (active: boolean) => (
        <SplitterGripProvider value={{ orientation, active }}>{gripEl ?? <Grip />}</SplitterGripProvider>
    );

    const renderResizer = (index: number) => {
        const resizerDisabled = isResizerDisabled(index);
        const active = activeResizerIndex === index;

        return (
            <div
                aria-controls={
                    [panels[index]?.props.id, panels[index + 1]?.props.id].filter(Boolean).join(' ') || undefined
                }
                aria-disabled={resizerDisabled}
                aria-orientation={separatorOrientation}
                aria-valuemax={panels[index].max}
                aria-valuemin={panels[index].min}
                aria-valuenow={sizes[index]}
                aria-valuetext={`${sizes[index]}%`}
                className={variants.resizer({ orientation, active })}
                data-disabled={resizerDisabled || undefined}
                key={`resizer-${panels[index].key}`}
                onDoubleClick={evt => handleResizerDoubleClick(index, evt)}
                onKeyDown={evt => handleResizerKeyDown(index, evt)}
                onPointerDown={evt => handleResizeStart(index, evt)}
                role="separator"
                style={resizerStyles[index]}
                tabIndex={resizerDisabled ? -1 : 0}
            >
                {!resizerDisabled && renderGrip(active)}
            </div>
        );
    };

    return (
        <div
            {...restProps}
            aria-disabled={disabled}
            className={cnMerge(variants.splitter({ orientation }), className)}
            data-disabled={disabled || undefined}
            ref={mergeRefs(ref, splitterRef)}
        >
            {panels.map((panel, index) => (
                <Fragment key={panel.key}>
                    {cloneElement(panel.el, {
                        style: getPanelStyle(sizes[index], panel.props.style),
                    })}
                    {index < panels.length - 1 && renderResizer(index)}
                </Fragment>
            ))}
        </div>
    );
});

Splitter.displayName = 'Splitter';

export default Splitter;
