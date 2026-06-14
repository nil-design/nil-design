import { ColorAreaController } from './hooks/useColorArea';
import variants from './style';

interface AreaProps {
    controller: ColorAreaController;
    disabled?: boolean;
    formattedValue: string;
}

const Area = ({ controller, disabled = false, formattedValue }: AreaProps) => {
    const { areaRef, areaSaturationStyle, areaStyle, areaThumbStyle, areaValueStyle, onKeyDown, onPointerDown } =
        controller;

    return (
        <div
            aria-label="Saturation and value"
            aria-valuetext={formattedValue}
            className={variants.area({ disabled })}
            data-disabled={disabled || undefined}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            ref={areaRef}
            role="application"
            style={areaStyle}
            tabIndex={disabled ? -1 : 0}
        >
            <span className={variants.areaLayer()} style={areaSaturationStyle} />
            <span className={variants.areaLayer()} style={areaValueStyle} />
            <span className={variants.areaThumb()} style={areaThumbStyle} />
        </div>
    );
};

Area.displayName = 'ColorPicker.Area';

export default Area;
