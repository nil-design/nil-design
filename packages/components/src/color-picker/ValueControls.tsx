import Input from '../input';
import Segment from '../segment';
import { ColorFormat } from './interfaces';
import variants from './style';

interface ValueControlsProps {
    draftValue: string;
    format: ColorFormat;
    inputInvalid?: boolean;
    disabled?: boolean;
    onFormatChange: (format: ColorFormat) => void;
    onInputBlur: () => void;
    onInputChange: (value: string | number) => void;
}

const ValueControls = ({
    disabled = false,
    draftValue,
    format,
    inputInvalid = false,
    onFormatChange,
    onInputBlur,
    onInputChange,
}: ValueControlsProps) => (
    <div className={variants.inputStack()}>
        <Segment<ColorFormat>
            aria-label="Color format"
            block
            className={variants.formatSegment()}
            disabled={disabled}
            size="small"
            value={format}
            onChange={onFormatChange}
        >
            <Segment.Item value="hex">HEX</Segment.Item>
            <Segment.Item value="rgb">RGB</Segment.Item>
            <Segment.Item value="hsl">HSL</Segment.Item>
        </Segment>
        <Input
            aria-invalid={inputInvalid || undefined}
            aria-label="Color value"
            className={variants.valueInput({ invalid: inputInvalid })}
            disabled={disabled}
            size="small"
            value={draftValue}
            onBlur={onInputBlur}
            onChange={onInputChange}
        />
    </div>
);

ValueControls.displayName = 'ColorPicker.ValueControls';

export default ValueControls;
