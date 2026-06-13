import { useIsomorphicLayoutEffect } from '@nild/hooks';
import { cnMerge } from '@nild/shared';
import { CSSProperties, KeyboardEventHandler, useMemo, useState } from 'react';
import { getCheckerboardStyle } from './_shared/checkerboard';
import { HslaColor, getColorCss, getHueCss, normalizeHue } from './_shared/color';
import Area from './Area';
import { ColorFormat, ColorPickerMeta, ColorPickerPreset } from './interfaces';
import PresetGrid from './PresetGrid';
import SliderControl from './SliderControl';
import variants from './style';
import Swatch from './Swatch';
import ValueControls from './ValueControls';
import type { ColorAreaController } from './hooks/useColorArea';
import type { CommitColor } from './hooks/useColorPickerState';

type ColorPickerStyle = CSSProperties & {
    '--nd-color-picker-alpha-color'?: string;
};

const ALPHA_TRACK_STYLE = getCheckerboardStyle(
    'linear-gradient(to right, transparent, var(--nd-color-picker-alpha-color))',
);

interface PanelProps {
    area: ColorAreaController;
    color: HslaColor;
    draftValue: string;
    format: ColorFormat;
    formattedValue: string;
    meta: ColorPickerMeta;
    presets: ColorPickerPreset[];
    selectedHex: string;
    className?: string;
    disabled?: boolean;
    inputInvalid?: boolean;
    onCommitColor: CommitColor;
    onFormatChange: (format: ColorFormat) => void;
    onInputBlur: () => void;
    onInputChange: (value: string | number) => void;
    onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

const Panel = ({
    area,
    className,
    color,
    disabled = false,
    draftValue,
    format,
    formattedValue,
    inputInvalid = false,
    meta,
    onCommitColor,
    onFormatChange,
    onInputBlur,
    onInputChange,
    onKeyDown,
    presets,
    selectedHex,
}: PanelProps) => {
    const [hue, setHue] = useState(color.h);
    const alphaStyle = useMemo<ColorPickerStyle>(
        () => ({
            '--nd-color-picker-alpha-color': getColorCss({ h: color.h, s: color.s, l: color.l, alpha: 1 }),
        }),
        [color.h, color.l, color.s],
    );

    useIsomorphicLayoutEffect(() => {
        if (normalizeHue(hue) !== normalizeHue(color.h)) {
            setHue(color.h);
        }
    }, [color.h, hue]);

    const commitHue = (h: number) => {
        setHue(h);
        onCommitColor({ ...color, h });
    };

    return (
        <div
            aria-label="Color picker"
            className={cnMerge(className, variants.panel())}
            onKeyDown={onKeyDown}
            role="dialog"
            tabIndex={-1}
        >
            <div className={variants.stack()}>
                <Area controller={area} disabled={disabled} formattedValue={formattedValue} />
                <div className={variants.sliderPreviewRow()}>
                    <div className={variants.sliderStack()}>
                        <SliderControl
                            disabled={disabled}
                            label="Hue"
                            max={360}
                            min={0}
                            step={1}
                            trackClassName={variants.hueTrack()}
                            thumbStyle={{ backgroundColor: getHueCss(hue) }}
                            value={hue}
                            onChange={commitHue}
                        />
                        <SliderControl
                            disabled={disabled}
                            label="Alpha"
                            max={1}
                            min={0}
                            step={0.01}
                            style={alphaStyle}
                            trackClassName={variants.alphaTrack()}
                            trackStyle={ALPHA_TRACK_STYLE}
                            thumbStyle={{ backgroundColor: getColorCss(color) }}
                            value={color.alpha}
                            onChange={alpha => onCommitColor({ ...color, alpha })}
                        />
                    </div>
                    <span className={variants.previewSwatch()}>
                        <Swatch css={meta.css} />
                    </span>
                </div>
                <ValueControls
                    disabled={disabled}
                    draftValue={draftValue}
                    format={format}
                    inputInvalid={inputInvalid}
                    onFormatChange={onFormatChange}
                    onInputBlur={onInputBlur}
                    onInputChange={onInputChange}
                />
                <PresetGrid
                    disabled={disabled}
                    presets={presets}
                    selectedHex={selectedHex}
                    onCommitColor={onCommitColor}
                />
            </div>
        </div>
    );
};

Panel.displayName = 'ColorPicker.Panel';

export default Panel;
