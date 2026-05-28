import { useControllableState, useEffectCallback, useIsomorphicLayoutEffect } from '@nild/hooks';
import { cnMerge, forwardRefWithGenerics, mergeRefs } from '@nild/shared';
import {
    ForwardedRef,
    ReactElement,
    ReactNode,
    Ref,
    RefAttributes,
    cloneElement,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useRovingIndexNavigation } from '../_shared/hooks';
import { mergeHandlers, registerSlots } from '../_shared/utils';
import { TabsProvider } from './contexts';
import { ListProps, PanelProps, TabProps, TabsProps } from './interfaces';
import { isListElement } from './List';
import { isPanelElement } from './Panel';
import variants from './style';
import { isTabElement } from './Tab';

type ListElement = ReactElement<ListProps & RefAttributes<HTMLDivElement>> & { ref?: Ref<HTMLDivElement> };
type TabElement<T> = ReactElement<TabProps<T> & RefAttributes<HTMLDivElement>> & { ref?: Ref<HTMLDivElement> };
type PanelElement<T> = ReactElement<PanelProps<T> & RefAttributes<HTMLDivElement>> & { ref?: Ref<HTMLDivElement> };

interface ParsedTab<T> {
    key: string;
    el: TabElement<T>;
    id: string;
    panelId?: string;
    props: TabProps<T>;
}

interface ParsedPanel<T> {
    key: string;
    el: PanelElement<T>;
    id: string;
    tabId?: string;
    props: PanelProps<T>;
}

const collectRootSlots = registerSlots({
    list: { isMatched: isListElement },
    panel: { isMatched: isPanelElement, multiple: true },
});

const collectListSlots = registerSlots({
    tab: { isMatched: isTabElement, multiple: true },
});

const parseTabs = <T,>(children: ReactNode, tabsId: string) => {
    const { slots } = collectRootSlots(children);
    const listEl = slots.list.el as ListElement | null;
    const { slots: listSlots } = collectListSlots(listEl?.props.children);
    const tabEls = listSlots.tab.el as TabElement<T>[];
    const panelEls = slots.panel.el as PanelElement<T>[];
    const tabs: ParsedTab<T>[] = [];
    const panels: ParsedPanel<T>[] = [];
    const enabledIndices: number[] = [];
    const tabIndicesByValue = new Map<T, number[]>();

    tabEls.forEach((tabEl, index) => {
        const tabValue = tabEl.props.value;
        const tabIndexes = tabIndicesByValue.get(tabValue);

        if (tabIndexes) {
            tabIndexes.push(index);
        } else {
            tabIndicesByValue.set(tabValue, [index]);
        }

        tabs.push({
            key: tabEl.key?.toString() ?? `${listSlots.tab.seq[index]}`,
            el: tabEl,
            id: tabEl.props.id ?? `${tabsId}-tab-${index}`,
            props: tabEl.props,
        });

        if (!tabEl.props.disabled) {
            enabledIndices.push(index);
        }
    });

    const matchedPanelValues = new Set<T>();

    panelEls.forEach((panelEl, index) => {
        const panelValue = panelEl.props.value;
        const tabIndex = tabIndicesByValue.get(panelValue)?.[0];
        const panelId = panelEl.props.id ?? `${tabsId}-panel-${index}`;

        panels.push({
            key: panelEl.key?.toString() ?? `${slots.panel.seq[index]}`,
            el: panelEl,
            id: panelId,
            tabId: tabIndex === undefined ? undefined : tabs[tabIndex].id,
            props: panelEl.props,
        });

        if (!matchedPanelValues.has(panelValue)) {
            matchedPanelValues.add(panelValue);
            tabIndicesByValue.get(panelValue)?.forEach(tabIndex => {
                tabs[tabIndex].panelId = panelId;
            });
        }
    });

    return {
        listEl,
        tabs,
        panels,
        enabledIndices,
        firstEnabledIndex: enabledIndices[0] ?? -1,
        getTabIndexByValue: (value: T | undefined) => tabIndicesByValue.get(value as T)?.[0] ?? -1,
    };
};

const Tabs = forwardRefWithGenerics(<T,>(props: TabsProps<T>, ref: ForwardedRef<HTMLDivElement>) => {
    const {
        className,
        children,
        value: externalValue,
        defaultValue,
        onChange,
        variant = 'line',
        size = 'medium',
        orientation = 'horizontal',
        activation = 'auto',
        disabled = false,
        closable = false,
        onClose,
        destroyOnInactive = false,
        ...restProps
    } = props;
    const tabsId = useId();
    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { listEl, tabs, panels, enabledIndices, firstEnabledIndex, getTabIndexByValue } = useMemo(
        () => parseTabs<T>(children, tabsId),
        [children, tabsId],
    );
    const defaultSelectedValue =
        defaultValue ?? (firstEnabledIndex >= 0 ? tabs[firstEnabledIndex].props.value : undefined);
    const [selectedValue, setSelectedValue] = useControllableState<T | undefined>(externalValue, defaultSelectedValue);
    const selectedIndex = getTabIndexByValue(selectedValue);
    const effectiveSelectedIndex = selectedIndex >= 0 ? selectedIndex : firstEnabledIndex;
    const effectiveValue = effectiveSelectedIndex >= 0 ? tabs[effectiveSelectedIndex].props.value : selectedValue;
    const effectiveTabId = effectiveSelectedIndex >= 0 ? tabs[effectiveSelectedIndex].id : undefined;
    const focusIndex = enabledIndices.includes(effectiveSelectedIndex) ? effectiveSelectedIndex : firstEnabledIndex;
    const [activeIndex, setActiveIndex] = useState(focusIndex);
    const enabledNavigationIndices = disabled ? [] : enabledIndices;

    const updateValue = useEffectCallback((nextValue: T) => {
        if (Object.is(selectedValue, nextValue)) {
            return;
        }

        setSelectedValue(nextValue);
        onChange?.(nextValue);
    });

    const selectAt = useEffectCallback((index: number) => {
        const tab = tabs[index];

        if (!tab || disabled || tab.props.disabled) {
            return;
        }

        updateValue(tab.props.value);
    });

    const focusTab = useEffectCallback((index: number) => {
        const $tab = tabRefs.current[index];

        if (!$tab || typeof window === 'undefined') {
            return;
        }

        window.requestAnimationFrame(() => {
            $tab.isConnected && $tab.focus();
        });
    });

    const updateActiveIndex = useEffectCallback((index: number) => {
        setActiveIndex(index);
        focusTab(index);
    });

    const { handleKeyDown } = useRovingIndexNavigation<HTMLDivElement>({
        orientation,
        activeIndex,
        selectedIndex: focusIndex,
        enabledIndices: enabledNavigationIndices,
        selectOnMove: activation === 'auto',
        selectOnConfirm: activation === 'manual',
        onActiveChange: updateActiveIndex,
        onSelect: selectAt,
        onKeyDown: listEl?.props.onKeyDown,
    });

    useIsomorphicLayoutEffect(() => {
        setActiveIndex(focusIndex);
    }, [focusIndex]);

    const renderTab = (tab: ParsedTab<T>, index: number) => {
        const { el: tabEl } = tab;
        const tabDisabled = disabled || !!tab.props.disabled;
        const active = index === activeIndex;
        const tabClosable = tab.props.closable ?? closable;

        return cloneElement<TabProps<T> & RefAttributes<HTMLDivElement>>(tabEl, {
            key: tab.key,
            id: tab.id,
            value: tab.props.value,
            'aria-controls': tab.panelId,
            disabled: tabDisabled,
            closable: tabClosable,
            tabIndex: active && !tabDisabled ? 0 : -1,
            onClick: mergeHandlers(tab.props.onClick, () => selectAt(index)),
            onFocus: mergeHandlers(tab.props.onFocus, () => {
                !tabDisabled && setActiveIndex(index);
            }),
            ref: mergeRefs(tabEl.ref, node => {
                tabRefs.current[index] = node;
            }),
        } as TabProps<T> & RefAttributes<HTMLDivElement>);
    };

    const renderPanel = (panel: ParsedPanel<T>) => {
        const selected = Object.is(panel.props.value, effectiveValue);

        if (destroyOnInactive && !selected) {
            return null;
        }

        return cloneElement<PanelProps<T> & RefAttributes<HTMLDivElement>>(panel.el, {
            key: panel.key,
            id: panel.id,
            value: panel.props.value,
            'aria-labelledby': panel.tabId,
            ref: panel.el.ref,
        } as PanelProps<T> & RefAttributes<HTMLDivElement>);
    };

    return (
        <TabsProvider
            value={{
                variant,
                size,
                orientation,
                selectedTabId: effectiveTabId,
                selectedValue: effectiveValue,
                onClose: onClose as TabsProps['onClose'],
            }}
        >
            <div
                {...restProps}
                className={cnMerge(variants.tabs({ variant, orientation, disabled }), className)}
                data-disabled={disabled || undefined}
                ref={ref}
            >
                {listEl &&
                    cloneElement<ListProps & RefAttributes<HTMLDivElement>>(listEl, {
                        ...listEl.props,
                        role: 'tablist',
                        'aria-orientation': orientation,
                        children: tabs.map(renderTab),
                        onKeyDown: handleKeyDown,
                        ref: listEl.ref,
                    } as ListProps & RefAttributes<HTMLDivElement>)}
                {panels.map(renderPanel)}
            </div>
        </TabsProvider>
    );
});

(Tabs as unknown as { displayName: string }).displayName = 'Tabs';

export default Tabs;
