import { useControllableState, useEffectCallback, useIsomorphicLayoutEffect } from '@nild/hooks';
import { useMemo, useRef, useState } from 'react';
import { DEFAULT_COLOR, getColorState, normalizeColor, normalizeHue, parseColorValue } from '../_shared/color';
import type { ColorState, HsvaColor } from '../_shared/color';
import type { ColorFormat, ColorPickerProps } from '../interfaces';

export type CommitColor = (nextColor: HsvaColor, nextFormat?: ColorFormat) => ColorState;

interface UseColorPickerStateOptions {
    value?: string;
    defaultValue?: string;
    format?: ColorFormat;
    defaultFormat?: ColorFormat;
    onChange?: ColorPickerProps['onChange'];
    onFormatChange?: ColorPickerProps['onFormatChange'];
}

interface ColorPickerStateController {
    color: HsvaColor;
    commitColor: CommitColor;
    css: string;
    draftValue: string;
    format: ColorFormat;
    formattedValue: string;
    hex: string;
    hue: number;
    inputInvalid: boolean;
    opaqueCss: string;
    completeInput: () => void;
    updateFormat: (format: ColorFormat) => void;
    updateHue: (hue: number) => void;
    updateInput: (value: string | number) => void;
}

const FALLBACK_COLOR = parseColorValue(DEFAULT_COLOR)!;

const getValidColor = (value: string | undefined) => parseColorValue(value) ?? FALLBACK_COLOR;

const useColorPickerState = ({
    value: externalValue,
    defaultValue,
    format: externalFormat,
    defaultFormat = 'hex',
    onChange,
    onFormatChange,
}: UseColorPickerStateOptions): ColorPickerStateController => {
    const [format, setFormat] = useControllableState<ColorFormat>(externalFormat, defaultFormat);
    const [value, setValue] = useControllableState<string | undefined>(externalValue, defaultValue);
    const valueControlled = externalValue !== undefined;
    const [color, setColor] = useState(() => getValidColor(value));
    const { css, formattedValue, hex, opaqueCss } = useMemo(() => getColorState(color, format), [color, format]);
    const [hue, setHue] = useState(color.h);
    const [draftValue, setDraftValue] = useState(formattedValue);
    const [inputInvalid, setInputInvalid] = useState(false);
    const inputFormattedValueRef = useRef<string | null>(null);
    const pendingColorRef = useRef<[string, HsvaColor] | null>(null);

    const commitColor = useEffectCallback((nextColor: HsvaColor, nextFormat: ColorFormat = format) => {
        const normalizedColor = normalizeColor(nextColor);
        const nextState = getColorState(normalizedColor, nextFormat);
        const valueChanged = !Object.is(value, nextState.formattedValue);

        if (!valueControlled || !valueChanged) {
            setColor(normalizedColor);
        }

        if (valueChanged) {
            pendingColorRef.current = [nextState.formattedValue, normalizedColor];
            setValue(nextState.formattedValue);
            onChange?.(nextState.formattedValue, nextState.meta);
        } else {
            pendingColorRef.current = null;
        }

        return nextState;
    });

    const updateFormat = useEffectCallback((nextFormat: ColorFormat) => {
        if (Object.is(format, nextFormat)) {
            return;
        }

        setFormat(nextFormat);
        onFormatChange?.(nextFormat);
        inputFormattedValueRef.current = null;
        commitColor(color, nextFormat);
    });

    const updateHue = useEffectCallback((nextHue: number) => {
        setHue(nextHue);
        commitColor({ ...color, h: nextHue });
    });

    const updateInput = useEffectCallback((nextValue: string | number) => {
        const nextDraftValue = `${nextValue}`;
        const nextColor = parseColorValue(nextDraftValue);

        setDraftValue(nextDraftValue);

        if (!nextColor) {
            setInputInvalid(true);

            return;
        }

        setInputInvalid(false);
        inputFormattedValueRef.current = commitColor(nextColor).formattedValue;
    });

    const completeInput = useEffectCallback(() => {
        inputFormattedValueRef.current = null;

        const nextColor = parseColorValue(draftValue);

        if (!nextColor) {
            setDraftValue(formattedValue);
            setInputInvalid(false);

            return;
        }

        const nextState = commitColor(nextColor);

        setDraftValue(nextState.formattedValue);
        setInputInvalid(false);
    });

    useIsomorphicLayoutEffect(() => {
        const pendingColor = pendingColorRef.current;

        pendingColorRef.current = null;

        setColor(pendingColor && Object.is(value, pendingColor[0]) ? pendingColor[1] : getValidColor(value));
    }, [value]);

    useIsomorphicLayoutEffect(() => {
        if (normalizeHue(hue) !== normalizeHue(color.h)) {
            setHue(color.h);
        }
    }, [color.h, hue]);

    useIsomorphicLayoutEffect(() => {
        if (inputFormattedValueRef.current === formattedValue) {
            inputFormattedValueRef.current = null;

            return;
        }

        setDraftValue(formattedValue);
        setInputInvalid(false);
    }, [formattedValue]);

    return {
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
    };
};

export default useColorPickerState;
