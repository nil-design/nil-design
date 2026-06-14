import { Icon } from '@nild/icons';
import CheckSmall from '@nild/icons/CheckSmall';
import { useMemo } from 'react';
import { getColorState, getReadableTextColor, parseColorValue } from './_shared/color';
import { ColorPickerPreset } from './interfaces';
import variants from './style';
import Swatch from './Swatch';
import type { CommitColor } from './hooks/useColorPickerState';

interface PresetGridProps {
    presets: ColorPickerPreset[];
    selectedHex: string;
    disabled?: boolean;
    onCommitColor: CommitColor;
}

const PresetGrid = ({ disabled = false, onCommitColor, presets, selectedHex }: PresetGridProps) => {
    const presetOptions = useMemo(
        () =>
            presets.flatMap(preset => {
                const value = typeof preset === 'string' ? preset : preset.value;
                const color = parseColorValue(value);

                if (!color) {
                    return [];
                }

                const optionState = getColorState(color, 'hex');

                return {
                    checkColor: getReadableTextColor(color),
                    color,
                    css: optionState.css,
                    hex: optionState.hex.toLowerCase(),
                    label: typeof preset === 'string' ? preset : (preset.label ?? value),
                    value,
                };
            }),
        [presets],
    );
    const selectedValue = selectedHex.toLowerCase();

    return (
        <div aria-label="Preset colors" className={variants.presets()}>
            {presetOptions.map(preset => {
                const selected = preset.hex === selectedValue;

                return (
                    <button
                        aria-label={preset.label}
                        aria-pressed={selected}
                        className={variants.preset()}
                        disabled={disabled}
                        key={preset.value}
                        onClick={() => onCommitColor(preset.color)}
                        type="button"
                    >
                        <Swatch css={preset.css} />
                        {selected && (
                            <span
                                aria-hidden="true"
                                className={variants.presetCheck()}
                                style={{ color: preset.checkColor }}
                            >
                                <Icon className={variants.presetCheckIcon()} component={CheckSmall} />
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

PresetGrid.displayName = 'ColorPicker.PresetGrid';

export default PresetGrid;
