import { useControllableState, useEffectCallback, useIsomorphicLayoutEffect } from '@nild/hooks';
import { cnMerge, forwardRefWithGenerics, mergeRefs } from '@nild/shared';
import {
    CSSProperties,
    ForwardedRef,
    ReactElement,
    ReactNode,
    Ref,
    RefAttributes,
    cloneElement,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useRovingIndexNavigation } from '../_shared/hooks';
import { mergeHandlers, registerSlots } from '../_shared/utils';
import { SegmentProvider } from './contexts';
import { ItemProps, SegmentProps } from './interfaces';
import { isItemElement } from './Item';
import variants from './style';

type ItemElement<T> = ReactElement<ItemProps<T> & RefAttributes<HTMLButtonElement>> & { ref?: Ref<HTMLButtonElement> };

interface ParsedItem<T> {
    key: string;
    element: ItemElement<T>;
    props: ItemProps<T>;
}

const collectSlots = registerSlots({
    item: { isMatched: isItemElement, multiple: true },
});

const parseChildren = <T,>(children: ReactNode) => {
    const { slots } = collectSlots(children);
    const itemElements = slots.item.el as ItemElement<T>[];
    const items: ParsedItem<T>[] = [];
    const enabledIndices: number[] = [];

    itemElements.forEach((itemElement, index) => {
        items.push({
            key: itemElement.key?.toString() ?? `${slots.item.seq[index]}`,
            element: itemElement,
            props: itemElement.props,
        });

        if (!itemElement.props.disabled) {
            enabledIndices.push(index);
        }
    });

    return {
        items,
        enabledIndices,
        firstEnabledIndex: enabledIndices[0] ?? -1,
    };
};

const Segment = forwardRefWithGenerics(<T,>(props: SegmentProps<T>, ref: ForwardedRef<HTMLDivElement>) => {
    const {
        className,
        children,
        value: externalValue,
        defaultValue,
        onChange,
        size = 'medium',
        orientation = 'horizontal',
        disabled = false,
        block = false,
        ...restProps
    } = props;
    const segmentRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({ opacity: 0 });
    const { items, enabledIndices, firstEnabledIndex } = useMemo(() => parseChildren<T>(children), [children]);
    const defaultSelectedValue =
        defaultValue ?? (firstEnabledIndex >= 0 ? items[firstEnabledIndex].props.value : undefined);
    const [selectedValue, setSelectedValue] = useControllableState<T | undefined>(externalValue, defaultSelectedValue);
    const selectedIndex = items.findIndex(item => Object.is(item.props.value, selectedValue));
    const effectiveSelectedIndex = selectedIndex >= 0 ? selectedIndex : firstEnabledIndex;
    const focusIndex = enabledIndices.includes(effectiveSelectedIndex) ? effectiveSelectedIndex : firstEnabledIndex;
    const [activeIndex, setActiveIndex] = useState(focusIndex);

    const updateValue = useEffectCallback((nextValue: T) => {
        if (Object.is(selectedValue, nextValue)) {
            return;
        }

        setSelectedValue(nextValue);
        onChange?.(nextValue);
    });

    const selectAt = useEffectCallback((index: number) => {
        const item = items[index];

        if (!item || disabled || item.props.disabled) {
            return;
        }

        updateValue(item.props.value);
    });

    const focusItem = useEffectCallback((index: number) => {
        const $item = itemRefs.current[index];

        if (!$item || typeof window === 'undefined') {
            return;
        }

        window.requestAnimationFrame(() => {
            $item.isConnected && $item.focus();
        });
    });

    const updateActiveIndex = useEffectCallback((index: number) => {
        setActiveIndex(index);
        focusItem(index);
    });

    const { handleKeyDown } = useRovingIndexNavigation<HTMLDivElement>({
        orientation,
        activeIndex,
        selectedIndex: focusIndex,
        enabledIndices: disabled ? [] : enabledIndices,
        selectOnMove: true,
        selectOnConfirm: true,
        onActiveChange: updateActiveIndex,
        onSelect: selectAt,
        onKeyDown: restProps.onKeyDown,
    });

    const updateIndicatorStyle = useEffectCallback(() => {
        const $segment = segmentRef.current;
        const $item = itemRefs.current[effectiveSelectedIndex];

        if (!$segment || !$item || effectiveSelectedIndex < 0) {
            setIndicatorStyle(current => (current.opacity === 0 ? current : { opacity: 0 }));

            return;
        }

        const nextStyle: CSSProperties = {
            opacity: 1,
            width: $item.offsetWidth,
            height: $item.offsetHeight,
            transform: `translate3d(${$item.offsetLeft}px, ${$item.offsetTop}px, 0)`,
        };

        setIndicatorStyle(current =>
            current.opacity === nextStyle.opacity &&
            current.width === nextStyle.width &&
            current.height === nextStyle.height &&
            current.transform === nextStyle.transform
                ? current
                : nextStyle,
        );
    });

    useIsomorphicLayoutEffect(() => {
        setActiveIndex(focusIndex);
    }, [focusIndex]);

    useIsomorphicLayoutEffect(() => {
        updateIndicatorStyle();

        const $segment = segmentRef.current;

        if (!$segment || typeof window === 'undefined') {
            return;
        }

        const ResizeObserverCtor = (window as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;

        if (ResizeObserverCtor) {
            const observer = new ResizeObserverCtor(updateIndicatorStyle);

            observer.observe($segment);
            itemRefs.current.slice(0, items.length).forEach($item => {
                $item && observer.observe($item);
            });

            return () => {
                observer.disconnect();
            };
        }

        window.addEventListener('resize', updateIndicatorStyle);

        return () => {
            window.removeEventListener('resize', updateIndicatorStyle);
        };
    }, [block, effectiveSelectedIndex, items, orientation, size, updateIndicatorStyle]);

    const renderItem = (item: ParsedItem<T>, index: number) => {
        const { element: itemElement } = item;
        const itemDisabled = disabled || !!item.props.disabled;
        const selected = index === effectiveSelectedIndex;
        const active = index === activeIndex;

        return (
            <SegmentProvider key={item.key} value={{ selected, size, orientation, block }}>
                {cloneElement<ItemProps<T> & RefAttributes<HTMLButtonElement>>(itemElement, {
                    value: item.props.value,
                    disabled: itemDisabled,
                    tabIndex: active && !itemDisabled ? 0 : -1,
                    onClick: mergeHandlers(item.props.onClick, () => selectAt(index)),
                    onFocus: mergeHandlers(item.props.onFocus, () => {
                        !itemDisabled && setActiveIndex(index);
                    }),
                    ref: mergeRefs(itemElement.ref, node => {
                        itemRefs.current[index] = node;
                    }),
                } as ItemProps<T> & RefAttributes<HTMLButtonElement>)}
            </SegmentProvider>
        );
    };

    return (
        <div
            {...restProps}
            aria-disabled={disabled}
            aria-orientation={orientation}
            className={cnMerge(variants.segment({ orientation, block }), className)}
            data-disabled={disabled || undefined}
            onKeyDown={handleKeyDown}
            ref={mergeRefs(ref, segmentRef)}
            role="radiogroup"
        >
            {items.length > 0 && <div aria-hidden="true" className={variants.indicator()} style={indicatorStyle} />}
            {items.map(renderItem)}
        </div>
    );
});

(Segment as unknown as { displayName: string }).displayName = 'Segment';

export default Segment;
