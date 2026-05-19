import { cnMerge, mergeRefs } from '@nild/shared';
import { forwardRef, useMemo, useRef } from 'react';
import useWatermarkLayer from './hooks/useWatermarkLayer';
import useWatermarkPreserve from './hooks/useWatermarkPreserve';
import { WatermarkProps } from './interfaces';
import variants from './style';

/**
 * @category Components
 */
const Watermark = forwardRef<HTMLDivElement, WatermarkProps>((props, ref) => {
    const {
        className,
        style,
        children,
        text: externalText,
        image: externalImage,
        pattern,
        textStyle,
        opacity,
        zIndex,
        preserve = true,
        onTamper,
        onError,
        ...restProps
    } = props;
    const rootRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMemo(() => mergeRefs(rootRef, ref), [ref]);
    const layerClassName = variants.layer();
    const { layerStyle } = useWatermarkLayer({
        rootRef,
        layerRef,
        text: externalText,
        image: externalImage,
        pattern,
        textStyle,
        opacity,
        zIndex,
        onError,
    });

    useWatermarkPreserve({ rootRef, layerRef, layerClassName, layerStyle, enabled: preserve, onTamper });

    return (
        <div {...restProps} className={cnMerge(variants.watermark(), className)} ref={mergedRef} style={style}>
            {children}
            <div aria-hidden="true" className={layerClassName} ref={layerRef} style={layerStyle} />
        </div>
    );
});

Watermark.displayName = 'Watermark';

export default Watermark;
