import type { OffsetOptions, Placement } from '@floating-ui/dom';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode } from 'react';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';
export type ColorPickerSize = 'small' | 'medium' | 'large';

export type ColorPickerMeta<T extends ColorFormat = ColorFormat> = T extends ColorFormat
    ? {
          alpha: number;
          css: string;
          format: T;
          valid: boolean;
      } & (T extends 'hex'
          ? { hex: string }
          : T extends 'rgb'
            ? { r: number; g: number; b: number }
            : { h: number; s: number; l: number })
    : never;

export type ColorPickerPreset = string | { label?: string; value: string };

export interface ColorPickerProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'defaultValue' | 'onChange' | 'value'> {
    children?: ReactNode;
    value?: string;
    defaultValue?: string;
    format?: ColorFormat;
    defaultFormat?: ColorFormat;
    onChange?: (value: string, meta: ColorPickerMeta) => void;
    onFormatChange?: (format: ColorFormat) => void;
    presets?: ColorPickerPreset[];
    size?: ColorPickerSize;
    disabled?: boolean;
    placement?: Placement;
    offset?: OffsetOptions;
    portalClassName?: string;
}

export interface TriggerProps extends HTMLAttributes<HTMLElement> {
    children?: ReactElement;
}
