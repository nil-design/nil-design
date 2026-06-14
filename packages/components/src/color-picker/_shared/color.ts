import { converter, formatHex, formatHex8, modeHsl, modeHsv, modeRgb, useMode as registerColorMode } from 'culori/fn';
import type { ColorFormat, ColorPickerMeta } from '../interfaces';
import type { Hsl, Hsv, Rgb } from 'culori/fn';

export interface HsvaColor {
    h: number;
    s: number;
    v: number;
    alpha: number;
}

export interface ColorState {
    css: string;
    formattedValue: string;
    hex: string;
    meta: ColorPickerMeta;
    opaqueCss: string;
}

const HEX_PREFIX = '#';

registerColorMode(modeRgb);
registerColorMode(modeHsl);
registerColorMode(modeHsv);

const toRgb = converter('rgb');
const toHsv = converter('hsv');
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

interface RgbChannels {
    b: number;
    g: number;
    r: number;
}

const getRgbChannels = (rgb: Rgb): RgbChannels => ({
    r: clamp(Math.round(rgb.r * 255), 0, 255),
    g: clamp(Math.round(rgb.g * 255), 0, 255),
    b: clamp(Math.round(rgb.b * 255), 0, 255),
});

const parseUnitChannel = (value: string | undefined) => {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return undefined;
    }

    const percent = trimmedValue.endsWith('%');
    const numericValue = Number(percent ? trimmedValue.slice(0, -1) : trimmedValue);

    if (Number.isNaN(numericValue)) {
        return undefined;
    }

    return percent || Math.abs(numericValue) > 1 ? numericValue / 100 : numericValue;
};

const parseAlpha = (value: string | undefined) => parseUnitChannel(value) ?? 1;

const getChannelTokens = (value: string) => {
    if (value.includes(',')) {
        return value.split(',').map(token => token.trim());
    }

    return value.split(/\s+/u).filter(Boolean);
};

const parseHsvValue = (value: string): HsvaColor | undefined => {
    const match = /^hsva?\((.*)\)$/iu.exec(value);

    if (!match) {
        return undefined;
    }

    const [channelValue, slashAlphaValue] = match[1].split('/').map(part => part.trim());
    const [hueValue, saturationValue, valueValue, commaAlphaValue] = getChannelTokens(channelValue);
    const hue = Number(hueValue?.replace(/deg$/iu, ''));
    const saturation = parseUnitChannel(saturationValue);
    const hsvValue = parseUnitChannel(valueValue);
    const alpha = parseAlpha(slashAlphaValue ?? commaAlphaValue);

    if (Number.isNaN(hue) || saturation === undefined || hsvValue === undefined) {
        return undefined;
    }

    return normalizeColor({
        alpha,
        h: hue,
        s: saturation,
        v: hsvValue,
    });
};

const getRgbColor = (color: HsvaColor) =>
    toRgb({
        mode: 'hsv',
        h: color.h,
        s: color.s,
        v: color.v,
        alpha: color.alpha,
    } as Hsv) as Rgb;

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

export const parseColorValue = (value: string | undefined): HsvaColor | undefined => {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return undefined;
    }

    const customHsv = parseHsvValue(trimmedValue);

    if (customHsv) {
        return customHsv;
    }

    const rgb = toRgb(trimmedValue);
    const hsv = toHsv(trimmedValue);

    if (!rgb || !hsv) {
        return undefined;
    }

    return {
        h: normalizeHue((hsv as Hsv).h),
        s: clampUnit((hsv as Hsv).s),
        v: clampUnit((hsv as Hsv).v),
        alpha: clampUnit((hsv as Hsv).alpha ?? (rgb as Rgb).alpha, 1),
    };
};

export const normalizeColor = (color: HsvaColor): HsvaColor => ({
    h: normalizeHue(color.h),
    s: clampUnit(color.s),
    v: clampUnit(color.v),
    alpha: clampUnit(color.alpha, 1),
});

const getRgbChannelsFromColor = (color: HsvaColor) => {
    const normalizedColor = normalizeColor(color);

    return {
        ...getRgbChannels(getRgbColor(normalizedColor)),
        normalizedColor,
    };
};

const formatRgbCss = ({ r, g, b }: RgbChannels, alpha = 1) =>
    alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${formatNumber(alpha)})` : `rgb(${r}, ${g}, ${b})`;

const formatHexColor = ({ r, g, b }: RgbChannels, alpha: number) => {
    const rgbColor: Rgb = {
        mode: 'rgb',
        r: r / 255,
        g: g / 255,
        b: b / 255,
        alpha,
    };

    return alpha < 1 ? formatHex8(rgbColor) : formatHex(rgbColor);
};

export const getHueCss = (hue: number) => `hsl(${formatNumber(normalizeHue(hue))} 100% 50%)`;

export const getReadableTextColor = (color: HsvaColor) => {
    const { r, g, b } = getRgbChannelsFromColor({ ...color, alpha: 1 });
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= DARK_TEXT_YIQ_THRESHOLD ? BLACK_COLOR : WHITE_COLOR;
};

export const getColorState = (color: HsvaColor, format: ColorFormat): ColorState => {
    const { normalizedColor, ...channels } = getRgbChannelsFromColor(color);
    const { r, g, b } = channels;
    const alphaIncluded = normalizedColor.alpha < 1;
    const alpha = formatNumber(normalizedColor.alpha);
    const css = formatRgbCss(channels, normalizedColor.alpha);
    const hex = formatHexColor(channels, normalizedColor.alpha);
    const baseState = {
        css,
        hex,
        opaqueCss: formatRgbCss(channels),
    };
    const baseMeta = {
        alpha: round(normalizedColor.alpha),
        css,
        valid: true,
    };

    if (format === 'rgb') {
        return {
            ...baseState,
            formattedValue: css,
            meta: {
                ...baseMeta,
                b,
                format,
                g,
                r,
            },
        };
    }

    if (format === 'hsv') {
        const h = formatNumber(normalizedColor.h);
        const s = formatNumber(normalizedColor.s * 100);
        const v = formatNumber(normalizedColor.v * 100);

        return {
            ...baseState,
            formattedValue: alphaIncluded ? `hsva(${h}, ${s}%, ${v}%, ${alpha})` : `hsv(${h}, ${s}%, ${v}%)`,
            meta: {
                ...baseMeta,
                format,
                h: round(normalizedColor.h),
                s: round(normalizedColor.s * 100),
                v: round(normalizedColor.v * 100),
            },
        };
    }

    if (format === 'hsl') {
        const hslColor = toHsl({
            mode: 'hsv',
            h: normalizedColor.h,
            s: normalizedColor.s,
            v: normalizedColor.v,
            alpha: normalizedColor.alpha,
        } as Hsv) as Hsl;
        const h = formatNumber(normalizeHue(hslColor.h ?? normalizedColor.h));
        const s = formatNumber(clampUnit(hslColor.s) * 100);
        const l = formatNumber(clampUnit(hslColor.l) * 100);

        return {
            ...baseState,
            formattedValue: alphaIncluded ? `hsla(${h}, ${s}%, ${l}%, ${alpha})` : `hsl(${h}, ${s}%, ${l}%)`,
            meta: {
                ...baseMeta,
                format,
                h: round(normalizedColor.h),
                l: round(clampUnit(hslColor.l) * 100),
                s: round(clampUnit(hslColor.s) * 100),
            },
        };
    }

    return {
        ...baseState,
        formattedValue: hex,
        meta: {
            ...baseMeta,
            format,
            hex,
        },
    };
};
