import { useControllableState, useEffectCallback, useIsomorphicLayoutEffect } from '@nild/hooks';
import { useMemo, useRef, useState } from 'react';
import { DEFAULT_COLOR, getColorState, parseColorValue } from '../_shared/color';
import type { ColorState, HslaColor } from '../_shared/color';
import type { ColorFormat, ColorPickerMeta, ColorPickerProps } from '../interfaces';

export type CommitColor = (nextColor: HslaColor, nextFormat?: ColorFormat) => ColorState;

interface UseColorPickerStateOptions {
    value?: string;
    defaultValue?: string;
    format?: ColorFormat;
    defaultFormat?: ColorFormat;
    onChange?: ColorPickerProps['onChange'];
    onFormatChange?: ColorPickerProps['onFormatChange'];
}

export interface ColorPickerStateController {
    color: HslaColor;
    commitColor: CommitColor;
    draftValue: string;
    format: ColorFormat;
    formattedValue: string;
    hex: string;
    inputInvalid: boolean;
    meta: ColorPickerMeta;
    completeInput: () => void;
    updateFormat: (format: ColorFormat) => void;
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
    const color = useMemo(() => getValidColor(value), [value]);
    const { formattedValue, hex, meta } = useMemo(() => getColorState(color, format), [color, format]);
    const [draftValue, setDraftValue] = useState(formattedValue);
    const [inputInvalid, setInputInvalid] = useState(false);
    const inputFormattedValueRef = useRef<string | null>(null);

    const commitColor = useEffectCallback((nextColor: HslaColor, nextFormat: ColorFormat = format) => {
        const nextState = getColorState(nextColor, nextFormat);

        if (!Object.is(value, nextState.formattedValue)) {
            setValue(nextState.formattedValue);
            onChange?.(nextState.formattedValue, nextState.meta);
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
        draftValue,
        format,
        formattedValue,
        hex,
        inputInvalid,
        meta,
        completeInput,
        updateFormat,
        updateInput,
    };
};

export default useColorPickerState;
