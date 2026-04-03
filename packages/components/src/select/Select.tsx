import { useControllableState, useIsomorphicLayoutEffect } from '@nild/hooks';
import { Icon } from '@nild/icons';
import Down from '@nild/icons/Down';
import { cnMerge, forwardRefWithGenerics, mergeRefs } from '@nild/shared';
import {
    cloneElement,
    ForwardedRef,
    ReactElement,
    ReactNode,
    Ref,
    RefAttributes,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';
import { mergeHandlers, registerSlots } from '../_shared/utils';
import Popup from '../popup';
import { useSelectNavigation } from './hooks';
import { MultipleSelectProps, SelectOptionProps, SelectProps, SingleSelectProps } from './interfaces';
import { isOptionElement } from './Option';
import variants from './style';

const collectSlots = registerSlots({
    option: { isMatched: child => isOptionElement(child), multiple: true },
});

interface ParsedOption<T> {
    key: string;
    selected: boolean;
    element: ReactElement<SelectOptionProps<T>>;
    props: SelectOptionProps<T>;
}

type Selection<T> = T | T[] | undefined;
type OptionElement<T> = ReactElement<SelectOptionProps<T> & RefAttributes<HTMLDivElement>> & {
    ref?: Ref<HTMLDivElement>;
};

const normalizeSelection = <T,>(selection: Selection<T>) => (Array.isArray(selection) ? selection : []);

const hasSameSelection = <T,>(multiple: boolean, current: Selection<T>, next: Selection<T>) => {
    if (!multiple) {
        return Object.is(current, next);
    }

    const currentValues = normalizeSelection(current);
    const nextValues = normalizeSelection(next);

    return (
        currentValues.length === nextValues.length &&
        currentValues.every((value, index) => Object.is(value, nextValues[index]))
    );
};

const toggleSelectionValue = <T,>(values: T[], value: T) =>
    values.some(item => Object.is(item, value)) ? values.filter(item => !Object.is(item, value)) : values.concat(value);

const parseOptions = <T,>(children: ReactNode, multiple: boolean, selection: Selection<T>) => {
    const { slots } = collectSlots(children);
    const optionElements = slots.option.el as ReactElement<SelectOptionProps<T>>[];
    const options: ParsedOption<T>[] = [];
    const enabledIndices: number[] = [];
    const selectionLabels: string[] = [];
    const selectionValues = multiple ? normalizeSelection(selection) : [];

    let selectionText = '';
    let selectionEmpty = true;
    let selectedIndex = -1;

    optionElements.forEach((optionElement, index) => {
        const optionProps = optionElement.props;
        const selected = multiple
            ? selectionValues.some(value => Object.is(value, optionProps.value))
            : Object.is(optionProps.value, selection);

        options.push({
            key: optionElement.key?.toString() ?? `${slots.option.seq[index]}`,
            selected,
            element: optionElement,
            props: optionProps,
        });

        if (!optionProps.disabled) {
            enabledIndices.push(index);
        }

        if (!selected) {
            return;
        }

        selectionEmpty = false;

        if (!optionProps.disabled && selectedIndex < 0) {
            selectedIndex = index;
        }

        if (multiple) {
            selectionLabels.push(optionProps.label);
        } else {
            selectionText = optionProps.label;
        }
    });

    return {
        options,
        enabledIndices,
        selectedIndex,
        selectionValues,
        selectionText: multiple ? selectionLabels.join(', ') : selectionText,
        selectionEmpty,
    };
};

const Select = forwardRefWithGenerics(<T,>(props: SelectProps<T>, ref: ForwardedRef<HTMLButtonElement>) => {
    const {
        className,
        children,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        onKeyDown: externalOnKeyDown,
        placeholder,
        variant = 'outlined',
        size = 'medium',
        block = false,
        disabled = false,
        placement = 'bottom-start',
        offset = 8,
        multiple = false,
        value: externalValue,
        defaultValue,
        onChange,
        ...restProps
    } = props as SelectProps<T> & { 'aria-label'?: string; 'aria-labelledby'?: string };

    const selectId = useId();
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLDivElement | null>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [opened, setOpened] = useState(false);
    const [selection, setSelection] = useControllableState<Selection<T>>(
        externalValue,
        multiple ? normalizeSelection(defaultValue) : defaultValue,
    );
    const { options, enabledIndices, selectedIndex, selectionValues, selectionText, selectionEmpty } = useMemo(
        () => parseOptions(children, multiple, selection),
        [children, multiple, selection],
    );
    const interactive = !disabled && enabledIndices.length > 0;
    const visibleOpen = interactive && opened;

    const openListbox = () => interactive && setOpened(true);

    const closeListbox = () => setOpened(false);

    const updateSelection = (nextSelection: Selection<T>) => {
        if (hasSameSelection(multiple, selection, nextSelection)) {
            return;
        }

        if (multiple) {
            (onChange as MultipleSelectProps<T>['onChange'] | undefined)?.(normalizeSelection(nextSelection));
        } else {
            (onChange as SingleSelectProps<T>['onChange'] | undefined)?.(nextSelection as T | undefined);
        }

        setSelection(() => nextSelection);
    };

    const selectAt = (index: number) => {
        const option = options[index];

        if (!option || option.props.disabled) {
            return;
        }

        if (multiple) {
            return updateSelection(toggleSelectionValue(selectionValues, option.props.value));
        }

        updateSelection(option.props.value);
        closeListbox();
        focusTrigger();
    };

    const {
        activeIndex,
        setActiveIndex,
        focusListbox,
        handleTriggerKeyDown,
        handleListboxKeyDown,
        handleListboxBlur,
        focusTrigger,
    } = useSelectNavigation({
        open: visibleOpen,
        selectedIndex,
        enabledIndices,
        triggerRef,
        listboxRef,
        optionRefs,
        onOpen: openListbox,
        onClose: closeListbox,
        onSelect: selectAt,
    });

    useIsomorphicLayoutEffect(() => {
        if (!interactive && opened) {
            setOpened(false);
        }
    }, [interactive, opened]);

    const getOptionId = (option: ParsedOption<T>, index: number) => option.props.id ?? `${selectId}-option-${index}`;

    const activeOption = activeIndex >= 0 ? options[activeIndex] : undefined;
    const activeOptionId = visibleOpen && activeOption ? getOptionId(activeOption, activeIndex) : undefined;

    const renderOption = (option: ParsedOption<T>, index: number) => {
        const optionElement = option.element as OptionElement<T>;

        return cloneElement<SelectOptionProps<T> & RefAttributes<HTMLDivElement>>(optionElement, {
            key: option.key,
            id: getOptionId(option, index),
            size,
            active: activeIndex === index,
            className: option.props.className,
            onClick: mergeHandlers(option.props.onClick, () => selectAt(index)),
            onMouseDown: mergeHandlers(option.props.onMouseDown, evt => evt.preventDefault()),
            onMouseEnter: mergeHandlers(option.props.onMouseEnter, () => {
                if (!option.props.disabled) {
                    setActiveIndex(index);
                }
            }),
            ref: mergeRefs(optionElement.ref, node => {
                optionRefs.current[index] = node;
            }),
            selected: option.selected,
        });
    };

    return (
        <Popup
            action="click"
            arrowed={false}
            disabled={!interactive}
            offset={offset}
            open={visibleOpen}
            placement={placement}
            onClose={closeListbox}
            onOpen={openListbox}
        >
            <Popup.Trigger>
                <button
                    {...restProps}
                    aria-expanded={visibleOpen}
                    aria-haspopup="listbox"
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledby}
                    className={cnMerge(
                        variants.trigger({
                            variant,
                            size,
                            block,
                            disabled,
                            open: visibleOpen,
                        }),
                        className,
                    )}
                    disabled={disabled}
                    onKeyDown={mergeHandlers(externalOnKeyDown, handleTriggerKeyDown)}
                    ref={mergeRefs(ref, triggerRef)}
                    type="button"
                >
                    <span
                        className={variants.triggerContent({
                            size,
                            placeholder: selectionEmpty,
                        })}
                    >
                        {selectionEmpty ? (placeholder ?? '') : selectionText}
                    </span>
                    <span
                        aria-hidden="true"
                        className={variants.triggerIcon({
                            size,
                            open: visibleOpen,
                        })}
                    >
                        <Icon component={Down} />
                    </span>
                </button>
            </Popup.Trigger>
            <Popup.Portal>
                <div
                    aria-activedescendant={activeOptionId}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledby}
                    aria-multiselectable={multiple || undefined}
                    className={variants.listbox()}
                    onBlur={handleListboxBlur}
                    onKeyDown={handleListboxKeyDown}
                    ref={node => {
                        listboxRef.current = node;
                        node && visibleOpen && focusListbox();
                    }}
                    role="listbox"
                    style={{ minWidth: triggerRef.current?.offsetWidth }}
                    tabIndex={-1}
                >
                    {options.map(renderOption)}
                </div>
            </Popup.Portal>
        </Popup>
    );
});

(Select as unknown as { displayName: string }).displayName = 'Select';

export default Select;
