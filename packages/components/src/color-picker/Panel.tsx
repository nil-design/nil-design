import { cnMerge } from '@nild/shared';
import { KeyboardEventHandler, useMemo } from 'react';
import { getCheckerboardStyle } from './_shared/checkerboard';
import { getHueCss } from './_shared/color';
import Area from './Area';
import { ColorFormat, ColorPickerPreset } from './interfaces';
import PresetGrid from './PresetGrid';
import SliderControl from './SliderControl';
import variants from './style';
import Swatch from './Swatch';
import ValueControls from './ValueControls';
import type { HsvaColor } from './_shared/color';
import type { ColorAreaController } from './hooks/useColorArea';
import type { CommitColor } from './hooks/useColorPickerState';
import type { CSSPropertiesWithVars } from '@nild/shared';

const ALPHA_TRACK_STYLE = getCheckerboardStyle(
    'linear-gradient(to right, transparent, var(--nd-color-picker-alpha-color))',
);

interface PanelProps {
    area: ColorAreaController;
    color: HsvaColor;
    colorCss: string;
    draftValue: string;
    format: ColorFormat;
    formattedValue: string;
    hue: number;
    opaqueColorCss: string;
    presets: ColorPickerPreset[];
    selectedHex: string;
    className?: string;
    disabled?: boolean;
    inputInvalid?: boolean;
    onCommitColor: CommitColor;
    onFormatChange: (format: ColorFormat) => void;
    onHueChange: (hue: number) => void;
    onInputBlur: () => void;
    onInputChange: (value: string | number) => void;
    onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

const Panel = ({
    area,
    className,
    color,
    colorCss,
    disabled = false,
    draftValue,
    format,
    formattedValue,
    hue,
    inputInvalid = false,
    onCommitColor,
    onFormatChange,
    onHueChange,
    onInputBlur,
    onInputChange,
    onKeyDown,
    opaqueColorCss,
    presets,
    selectedHex,
}: PanelProps) => {
    const alphaStyle = useMemo<CSSPropertiesWithVars>(
        () => ({
            '--nd-color-picker-alpha-color': opaqueColorCss,
        }),
        [opaqueColorCss],
    );

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
                            onChange={onHueChange}
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
                            thumbStyle={{ backgroundColor: colorCss }}
                            value={color.alpha}
                            onChange={alpha => onCommitColor({ ...color, alpha })}
                        />
                    </div>
                    <span className={variants.previewSwatch()}>
                        <Swatch css={colorCss} />
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
