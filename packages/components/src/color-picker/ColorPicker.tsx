import { useEffectCallback } from '@nild/hooks';
import { KeyboardEvent, ReactElement, forwardRef, useMemo, useRef, useState } from 'react';
import { registerSlots } from '../_shared/utils';
import Popup from '../popup';
import { DEFAULT_PRESET_COLORS } from './_shared/color';
import DefaultTrigger from './DefaultTrigger';
import useColorArea from './hooks/useColorArea';
import useColorPickerState from './hooks/useColorPickerState';
import { ColorPickerProps } from './interfaces';
import Panel from './Panel';
import { isTriggerElement } from './Trigger';

const collectSlots = registerSlots({
    trigger: { isMatched: isTriggerElement },
});

/**
 * @category Components
 */
const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>((props, ref) => {
    const {
        className,
        children,
        value: externalValue,
        defaultValue,
        format: externalFormat,
        defaultFormat = 'hex',
        onChange,
        onFormatChange,
        presets = DEFAULT_PRESET_COLORS,
        size = 'medium',
        disabled = false,
        placement = 'bottom-start',
        offset = 8,
        portalClassName,
        onKeyDown,
        ...restProps
    } = props;
    const { slots } = useMemo(() => collectSlots(children), [children]);
    const triggerRef = useRef<HTMLElement | null>(null);
    const [opened, setOpened] = useState(false);
    const visibleOpen = opened && !disabled;
    const {
        color,
        commitColor,
        draftValue,
        format,
        formattedValue,
        hex,
        inputInvalid,
        meta,
        completeInput,
        updateFormat,
        updateInput,
    } = useColorPickerState({
        defaultFormat,
        defaultValue,
        format: externalFormat,
        onChange,
        onFormatChange,
        value: externalValue,
    });
    const area = useColorArea({
        color,
        disabled,
        onCommitColor: commitColor,
    });

    const closePanel = useEffectCallback((focusTrigger = false) => {
        setOpened(false);
        focusTrigger && triggerRef.current?.focus();
    });

    const openPanel = useEffectCallback(() => {
        if (!disabled) {
            setOpened(true);
        }
    });

    const handlePanelKeyDown = useEffectCallback((evt: KeyboardEvent<HTMLDivElement>) => {
        if (evt.key !== 'Escape') {
            return;
        }

        evt.preventDefault();
        closePanel(true);
    });

    const handleTriggerKeyDown = useEffectCallback((evt: KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(evt as KeyboardEvent<HTMLButtonElement>);

        if (evt.defaultPrevented || disabled) {
            return;
        }

        switch (evt.key) {
            case 'Enter':
            case ' ':
                evt.preventDefault();
                setOpened(current => !current);
                break;
            case 'Escape':
                if (visibleOpen) {
                    evt.preventDefault();
                    closePanel(true);
                }
                break;
            default:
                break;
        }
    });

    return (
        <Popup
            action="click"
            arrowed={false}
            disabled={disabled}
            offset={offset}
            open={visibleOpen}
            placement={placement}
            onClose={() => closePanel()}
            onOpen={openPanel}
        >
            <Popup.Trigger>
                <DefaultTrigger
                    {...restProps}
                    className={className}
                    colorCss={meta.css}
                    customTrigger={slots.trigger.el as ReactElement<{ children?: ReactElement }> | null}
                    disabled={disabled}
                    open={visibleOpen}
                    ref={ref}
                    size={size}
                    triggerRef={triggerRef}
                    onKeyDown={handleTriggerKeyDown}
                />
            </Popup.Trigger>
            <Popup.Portal className={portalClassName}>
                <Panel
                    area={area}
                    color={color}
                    disabled={disabled}
                    draftValue={draftValue}
                    format={format}
                    formattedValue={formattedValue}
                    inputInvalid={inputInvalid}
                    meta={meta}
                    presets={presets}
                    selectedHex={hex}
                    onCommitColor={commitColor}
                    onFormatChange={updateFormat}
                    onInputBlur={completeInput}
                    onInputChange={updateInput}
                    onKeyDown={handlePanelKeyDown}
                />
            </Popup.Portal>
        </Popup>
    );
});

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
