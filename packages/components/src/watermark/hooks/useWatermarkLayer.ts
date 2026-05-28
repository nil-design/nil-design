import { useEffectCallback, useRefState } from '@nild/hooks';
import { CSSProperties, RefObject, useCallback, useEffect, useMemo } from 'react';
import { getComputedStyleValue } from '../../_shared/utils';
import { RenderParams, createTile, normalizeContent, normalizeImage, toTuple } from '../_shared/canvas';
import { WatermarkImage, WatermarkProps } from '../interfaces';

type TileState = {
    dataUrl: string | null;
    size: { width: number; height: number } | null;
};

const emptyTile: TileState = { dataUrl: null, size: null };

interface UseWatermarkLayerOptions {
    rootRef: RefObject<HTMLDivElement>;
    layerRef: RefObject<HTMLDivElement>;
    text?: WatermarkProps['text'];
    image?: WatermarkProps['image'];
    pattern?: WatermarkProps['pattern'];
    textStyle?: WatermarkProps['textStyle'];
    opacity?: WatermarkProps['opacity'];
    zIndex?: WatermarkProps['zIndex'];
    onError?: WatermarkProps['onError'];
}

export const useWatermarkLayer = (options: UseWatermarkLayerOptions) => {
    const {
        rootRef,
        layerRef,
        text: externalText,
        image: externalImage,
        pattern,
        textStyle,
        opacity,
        zIndex,
        onError,
    } = options;
    const [tile, setTile, tileRef] = useRefState<TileState>(emptyTile);

    const contentKey = useMemo(() => normalizeContent(externalText).join('\n'), [externalText]);

    const resolvedImage = useMemo(() => {
        const image = normalizeImage(externalImage);

        return image ? { ...image } : undefined;
    }, [externalImage]);

    const resolvedPattern = useMemo<RenderParams['pattern']>(() => {
        const [gapX, gapY] = toTuple(pattern?.gap, [64, 48]);
        const [offsetX, offsetY] = toTuple(pattern?.offset, [0, 0]);

        return {
            gap: [gapX, gapY],
            offset: [offsetX, offsetY],
            rotate: pattern?.rotate ?? -22,
            composition: pattern?.composition ?? 'stack',
            compositionGap: pattern?.compositionGap ?? 8,
        };
    }, [pattern?.composition, pattern?.compositionGap, pattern?.gap, pattern?.offset, pattern?.rotate]);

    const resolveTextStyle = useCallback((): RenderParams['textStyle'] => {
        const fontSize = textStyle?.fontSize ?? 16;
        const layerColor = getComputedStyleValue(layerRef.current, 'color');

        return {
            fontSize,
            fontWeight: textStyle?.fontWeight ?? 400,
            fontFamily:
                textStyle?.fontFamily ||
                getComputedStyleValue(rootRef.current, 'fontFamily') ||
                "-apple-system, blinkmacsystemfont, 'Segoe UI', roboto, 'Helvetica Neue', arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
            fontStyle: textStyle?.fontStyle ?? 'normal',
            lineHeight: textStyle?.lineHeight ?? fontSize * 1.4,
            color: textStyle?.color ? layerColor || textStyle.color : layerColor || 'currentColor',
            textAlign: textStyle?.textAlign ?? 'center',
        };
    }, [
        layerRef,
        rootRef,
        textStyle?.color,
        textStyle?.fontFamily,
        textStyle?.fontSize,
        textStyle?.fontStyle,
        textStyle?.fontWeight,
        textStyle?.lineHeight,
        textStyle?.textAlign,
    ]);

    const handleError = useEffectCallback((error: Event | Error, errorImage: WatermarkImage) => {
        onError?.(error, errorImage);
    });

    const updateTile = useCallback(
        (nextTile: TileState) => {
            const { current } = tileRef;

            if (
                current.dataUrl !== nextTile.dataUrl ||
                current.size?.width !== nextTile.size?.width ||
                current.size?.height !== nextTile.size?.height
            ) {
                setTile(nextTile);
            }
        },
        [setTile, tileRef],
    );

    useEffect(() => {
        let canceled = false;
        const content = contentKey ? contentKey.split('\n') : [];

        if (!content.length && !resolvedImage) {
            updateTile(emptyTile);

            return undefined;
        }

        createTile({
            content,
            image: resolvedImage,
            pattern: resolvedPattern,
            textStyle: resolveTextStyle(),
        }).then(result => {
            if (canceled) {
                return;
            }

            updateTile({
                dataUrl: result.dataUrl,
                size: result.width && result.height ? { width: result.width, height: result.height } : null,
            });

            if (result.error && result.image) {
                handleError(result.error, result.image);
            }
        });

        return () => {
            canceled = true;
        };
    }, [handleError, contentKey, resolvedImage, resolvedPattern, resolveTextStyle, updateTile]);

    const layerStyle: CSSProperties = {
        backgroundImage: tile.dataUrl ? `url(${tile.dataUrl})` : undefined,
        backgroundSize: tile.size ? `${tile.size.width}px ${tile.size.height}px` : undefined,
        backgroundPosition: `${resolvedPattern.offset[0]}px ${resolvedPattern.offset[1]}px`,
        color: textStyle?.color,
        opacity: opacity ?? 0.16,
        zIndex: zIndex ?? 1,
    };

    return { layerStyle };
};

export default useWatermarkLayer;
