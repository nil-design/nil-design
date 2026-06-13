import { converter, formatHex, formatHex8, modeHsl, modeRgb, useMode as registerColorMode } from 'culori/fn';
import type { ColorFormat, ColorPickerMeta } from '../interfaces';
import type { Hsl, Rgb } from 'culori/fn';

export interface HslaColor {
    h: number;
    s: number;
    l: number;
    alpha: number;
}

export interface ColorState {
    formattedValue: string;
    hex: string;
    meta: ColorPickerMeta;
}

const HEX_PREFIX = '#';

registerColorMode(modeRgb);
registerColorMode(modeHsl);

const toRgb = converter('rgb');
const toHsl = converter('hsl');
const DARK_TEXT_YIQ_THRESHOLD = 160;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const clampUnit = (value: number | undefined, fallback = 0) => clamp(value ?? fallback, 0, 1);

export const normalizeHue = (hue: number | undefined) => {
    if (hue === undefined || Number.isNaN(hue)) {
        return 0;
    }

    return ((hue % 360) + 360) % 360;
};

const channelToHex = (channel: number) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0');

const round = (value: number, precision = 2) => Number(value.toFixed(precision));

const formatNumber = (value: number, precision = 2) => `${round(value, precision)}`;

const getRgbChannels = (rgb: Rgb) => ({
    r: clamp(Math.round(rgb.r * 255), 0, 255),
    g: clamp(Math.round(rgb.g * 255), 0, 255),
    b: clamp(Math.round(rgb.b * 255), 0, 255),
});

export const createHexColor = (r: number, g: number, b: number, alpha = 1) => {
    const hex = `${HEX_PREFIX}${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;

    return alpha < 1 ? `${hex}${channelToHex(alpha * 255)}` : hex;
};

export const DEFAULT_COLOR = createHexColor(22, 119, 255);

export const DEFAULT_PRESET_COLORS = [
    [22, 119, 255],
    [19, 194, 194],
    [82, 196, 26],
    [250, 173, 20],
    [245, 34, 45],
    [114, 46, 209],
    [0, 0, 0],
    [255, 255, 255],
].map(([r, g, b]) => createHexColor(r, g, b));

export const BLACK_COLOR = createHexColor(0, 0, 0);
export const WHITE_COLOR = createHexColor(255, 255, 255);

export const parseColorValue = (value: string | undefined): HslaColor | undefined => {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return undefined;
    }

    const rgb = toRgb(trimmedValue);
    const hsl = toHsl(trimmedValue);

    if (!rgb || !hsl) {
        return undefined;
    }

    return {
        h: normalizeHue((hsl as Hsl).h),
        s: clampUnit((hsl as Hsl).s),
        l: clampUnit((hsl as Hsl).l),
        alpha: clampUnit((hsl as Hsl).alpha ?? (rgb as Rgb).alpha, 1),
    };
};

export const normalizeColor = (color: HslaColor): HslaColor => ({
    h: normalizeHue(color.h),
    s: clampUnit(color.s),
    l: clampUnit(color.l),
    alpha: clampUnit(color.alpha, 1),
});

export const getHueCss = (hue: number) => `hsl(${formatNumber(normalizeHue(hue))} 100% 50%)`;

export const getColorCss = (color: HslaColor) => {
    const normalizedColor = normalizeColor(color);
    const h = formatNumber(normalizedColor.h);
    const s = formatNumber(normalizedColor.s * 100);
    const l = formatNumber(normalizedColor.l * 100);

    return `hsl(${h} ${s}% ${l}% / ${formatNumber(normalizedColor.alpha)})`;
};

export const getReadableTextColor = (color: HslaColor) => {
    const normalizedColor = normalizeColor(color);
    const rgb = toRgb({
        mode: 'hsl',
        h: normalizedColor.h,
        s: normalizedColor.s,
        l: normalizedColor.l,
        alpha: 1,
    }) as Rgb | undefined;

    if (!rgb) {
        return BLACK_COLOR;
    }

    const { r, g, b } = getRgbChannels(rgb);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= DARK_TEXT_YIQ_THRESHOLD ? BLACK_COLOR : WHITE_COLOR;
};

export const getColorState = (color: HslaColor, format: ColorFormat): ColorState => {
    const normalizedColor = normalizeColor(color);
    const hslColor: Hsl = {
        mode: 'hsl',
        h: normalizedColor.h,
        s: normalizedColor.s,
        l: normalizedColor.l,
        alpha: normalizedColor.alpha,
    };
    const rgb = toRgb(hslColor) as Rgb;
    const { r, g, b } = getRgbChannels(rgb);
    const rgbColor: Rgb = {
        mode: 'rgb',
        r: r / 255,
        g: g / 255,
        b: b / 255,
        alpha: normalizedColor.alpha,
    };
    const alphaIncluded = normalizedColor.alpha < 1;
    const alpha = formatNumber(normalizedColor.alpha);
    const hex = alphaIncluded ? formatHex8(rgbColor) : formatHex(rgbColor);
    const h = formatNumber(normalizedColor.h);
    const s = formatNumber(normalizedColor.s * 100);
    const l = formatNumber(normalizedColor.l * 100);
    const formattedValue = {
        hex,
        rgb: alphaIncluded ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`,
        hsl: alphaIncluded ? `hsla(${h}, ${s}%, ${l}%, ${alpha})` : `hsl(${h}, ${s}%, ${l}%)`,
    };
    const baseMeta = {
        alpha: round(normalizedColor.alpha),
        css: formattedValue.rgb,
        valid: true,
    };
    const meta: ColorPickerMeta =
        format === 'rgb'
            ? {
                  ...baseMeta,
                  b,
                  format,
                  g,
                  r,
              }
            : format === 'hsl'
              ? {
                    ...baseMeta,
                    format,
                    h: round(normalizedColor.h),
                    l: round(normalizedColor.l * 100),
                    s: round(normalizedColor.s * 100),
                }
              : {
                    ...baseMeta,
                    format,
                    hex,
                };

    return {
        formattedValue: formattedValue[format],
        hex,
        meta,
    };
};
