import { useEffectCallback, useIsomorphicLayoutEffect } from '@nild/hooks';
import { KeyboardEvent, ReactElement, Ref, cloneElement, forwardRef, useMemo, useRef, useState } from 'react';
import { mergeProps, registerSlots } from '../_shared/utils';
import Popup from '../popup';
import { DEFAULT_PRESET_COLORS } from './_shared/color';
import { ColorPickerTriggerProvider } from './contexts';
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
        'aria-label': ariaLabel,
        ...restProps
    } = props;
    const { slots } = useMemo(() => collectSlots(children), [children]);
    const customTriggerEl = slots.trigger.el as ReactElement<Record<string, unknown>> | null;
    const triggerProps = {
        ...restProps,
        'aria-label': ariaLabel,
        className,
        onKeyDown,
    };
    const triggerRef = useRef<HTMLElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const [opened, setOpened] = useState(false);
    const visibleOpen = opened && !disabled;
    const {
        color,
        commitColor,
        css,
        draftValue,
        format,
        formattedValue,
        hex,
        hue,
        inputInvalid,
        opaqueCss,
        completeInput,
        updateFormat,
        updateHue,
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
        colorCss: css,
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

    useIsomorphicLayoutEffect(() => {
        if (visibleOpen) {
            panelRef.current?.focus();
        }
    }, [visibleOpen]);

    return (
        <ColorPickerTriggerProvider
            value={{
                disabled,
                onKeyDown: handleTriggerKeyDown,
                open: visibleOpen,
                rootRef: ref as Ref<HTMLElement>,
                triggerRef,
            }}
        >
            <Popup
                action="click"
                arrowed={false}
                disabled={disabled}
                offset={offset}
                open={visibleOpen}
                placement={placement}
                onClose={closePanel}
                onOpen={openPanel}
            >
                <Popup.Trigger>
                    {customTriggerEl ? (
                        cloneElement(
                            customTriggerEl,
                            mergeProps(triggerProps as Record<string, unknown>, customTriggerEl.props),
                        )
                    ) : (
                        <DefaultTrigger {...triggerProps} colorCss={css} size={size} />
                    )}
                </Popup.Trigger>
                <Popup.Portal className={portalClassName}>
                    <Panel
                        area={area}
                        color={color}
                        colorCss={css}
                        disabled={disabled}
                        draftValue={draftValue}
                        format={format}
                        formattedValue={formattedValue}
                        hue={hue}
                        inputInvalid={inputInvalid}
                        opaqueColorCss={opaqueCss}
                        presets={presets}
                        selectedHex={hex}
                        onCommitColor={commitColor}
                        onFormatChange={updateFormat}
                        onHueChange={updateHue}
                        onInputBlur={completeInput}
                        onInputChange={updateInput}
                        onKeyDown={handlePanelKeyDown}
                        ref={panelRef}
                    />
                </Popup.Portal>
            </Popup>
        </ColorPickerTriggerProvider>
    );
});

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
