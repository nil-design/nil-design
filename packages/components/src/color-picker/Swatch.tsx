import { CHECKERBOARD_STYLE } from './_shared/checkerboard';
import variants from './style';

interface SwatchProps {
    css: string;
}

const Swatch = ({ css }: SwatchProps) => (
    <span aria-hidden="true" className={variants.swatch()} style={CHECKERBOARD_STYLE}>
        <span className={variants.swatchColor()} style={{ backgroundColor: css }} />
    </span>
);

Swatch.displayName = 'ColorPicker.Swatch';

export default Swatch;
