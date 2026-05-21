import { getDPR, makeArray } from '@nild/shared';
import { WatermarkImage, WatermarkPattern, WatermarkProps, WatermarkTextStyle } from '../interfaces';

export interface RenderParams {
    content: string[];
    image?: WatermarkImage;
    pattern: Required<Omit<WatermarkPattern, 'composition' | 'gap' | 'offset'>> & {
        composition: NonNullable<WatermarkPattern['composition']>;
        gap: [number, number];
        offset: [number, number];
    };
    textStyle: Required<Omit<WatermarkTextStyle, 'textAlign'>> & {
        textAlign: NonNullable<WatermarkTextStyle['textAlign']>;
    };
}

export interface RenderResult {
    dataUrl: string | null;
    width?: number;
    height?: number;
    error?: Event | Error;
    image?: WatermarkImage;
}

interface Size {
    width: number;
    height: number;
}

interface ContentMetrics extends Size {
    textWidth: number;
    textHeight: number;
    imageSize: Size | null;
}

export const toTuple = (value: number | [number, number] | undefined, fallback: [number, number]): [number, number] =>
    Array.isArray(value) ? value : typeof value === 'number' ? [value, value] : fallback;

export const normalizeContent = (text: WatermarkProps['text']) =>
    text
        ? makeArray(text)
              .flatMap(item => item.split('\n'))
              .map(item => item.trim())
              .filter(Boolean)
        : [];

export const normalizeImage = (image: WatermarkProps['image']): WatermarkImage | undefined =>
    !image ? undefined : typeof image === 'string' ? { src: image } : image.src ? image : undefined;

const loadImage = (image: WatermarkImage) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const $image = new Image();
        let settled = false;

        if (image.crossOrigin !== undefined) {
            $image.crossOrigin = image.crossOrigin;
        }

        $image.onload = () => {
            if (settled) {
                return;
            }

            settled = true;
            resolve($image);
        };
        $image.onerror = error => {
            if (settled) {
                return;
            }

            settled = true;
            reject(error);
        };
        $image.src = image.src;

        if ($image.complete && ($image.naturalWidth || $image.width)) {
            settled = true;
            resolve($image);
        }
    });
};

const getImageSize = (image: WatermarkImage, $image: HTMLImageElement, lineHeight: number) => {
    const naturalWidth = $image.naturalWidth || $image.width || 1;
    const naturalHeight = $image.naturalHeight || $image.height || 1;
    const ratio = naturalWidth / naturalHeight;
    const widthProvided = typeof image.width === 'number';
    const heightProvided = typeof image.height === 'number';

    if (widthProvided || heightProvided) {
        return {
            width: image.width ?? image.height! * ratio,
            height: image.height ?? image.width! / ratio,
        };
    }

    const scale = Number.isFinite(image.scale) ? image.scale! : 1;
    const height = Math.max(1, lineHeight * scale);

    return { width: height * ratio, height };
};

const getTextX = (textAlign: CanvasTextAlign, centerX: number, width: number) =>
    textAlign === 'left' || textAlign === 'start'
        ? centerX - width / 2
        : textAlign === 'right' || textAlign === 'end'
          ? centerX + width / 2
          : centerX;

const drawText = (
    ctx: CanvasRenderingContext2D,
    lines: string[],
    centerX: number,
    centerY: number,
    blockWidth: number,
    lineHeight: number,
    textAlign: CanvasTextAlign,
) => {
    const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
    const x = getTextX(textAlign, centerX, blockWidth);

    lines.forEach((line, index) => {
        const metrics = ctx.measureText(line);
        const ascent =
            typeof metrics.actualBoundingBoxAscent === 'number' ? metrics.actualBoundingBoxAscent : lineHeight / 2;
        const descent =
            typeof metrics.actualBoundingBoxDescent === 'number' ? metrics.actualBoundingBoxDescent : lineHeight / 2;
        const y = startY + index * lineHeight + (ascent - descent) / 2;

        ctx.fillText(line, x, y, blockWidth);
    });
};

const drawImage = (
    ctx: CanvasRenderingContext2D,
    $image: HTMLImageElement,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
) => {
    ctx.drawImage($image, centerX - width / 2, centerY - height / 2, width, height);
};

const getTextSize = (ctx: CanvasRenderingContext2D, lines: string[], lineHeight: number): Size =>
    lines.length
        ? {
              width: Math.max(...lines.map(line => ctx.measureText(line).width), 1),
              height: Math.max(1, lines.length * lineHeight),
          }
        : { width: 0, height: 0 };

const getLayout = (ctx: CanvasRenderingContext2D, params: RenderParams, $image?: HTMLImageElement) => {
    const { content, image, pattern, textStyle } = params;
    const { width: textWidth, height: textHeight } = getTextSize(ctx, content, textStyle.lineHeight);
    const imageSize = image && $image ? getImageSize(image, $image, textStyle.lineHeight) : null;

    if (imageSize && content.length && pattern.composition === 'stack') {
        return {
            width: Math.max(imageSize.width, textWidth),
            height: imageSize.height + pattern.compositionGap + textHeight,
            textWidth,
            textHeight,
            imageSize,
        };
    }

    if (imageSize && content.length && pattern.composition === 'inline') {
        return {
            width: imageSize.width + pattern.compositionGap + textWidth,
            height: Math.max(imageSize.height, textHeight),
            textWidth,
            textHeight,
            imageSize,
        };
    }

    return {
        width: Math.max(imageSize?.width ?? 0, textWidth),
        height: Math.max(imageSize?.height ?? 0, textHeight),
        textWidth,
        textHeight,
        imageSize,
    };
};

const getRotatedSize = (width: number, height: number, rotate: number): Size => {
    const radian = (rotate * Math.PI) / 180;
    const cos = Math.abs(Math.cos(radian));
    const sin = Math.abs(Math.sin(radian));

    return {
        width: Math.ceil(width * cos + height * sin),
        height: Math.ceil(width * sin + height * cos),
    };
};

const drawContent = (
    ctx: CanvasRenderingContext2D,
    params: RenderParams,
    layout: ContentMetrics,
    $image?: HTMLImageElement,
) => {
    const { content, pattern, textStyle } = params;
    const { imageSize, textHeight, textWidth } = layout;

    if (imageSize && content.length && pattern.composition === 'stack') {
        const totalHeight = imageSize.height + pattern.compositionGap + textHeight;
        const imageCenterY = -totalHeight / 2 + imageSize.height / 2;
        const textCenterY = totalHeight / 2 - textHeight / 2;

        drawImage(ctx, $image!, 0, imageCenterY, imageSize.width, imageSize.height);
        drawText(ctx, content, 0, textCenterY, textWidth, textStyle.lineHeight, textStyle.textAlign);

        return;
    }

    if (imageSize && content.length && pattern.composition === 'inline') {
        const totalWidth = imageSize.width + pattern.compositionGap + textWidth;
        const imageCenterX = -totalWidth / 2 + imageSize.width / 2;
        const textCenterX = totalWidth / 2 - textWidth / 2;

        drawImage(ctx, $image!, imageCenterX, 0, imageSize.width, imageSize.height);
        drawText(ctx, content, textCenterX, 0, textWidth, textStyle.lineHeight, textStyle.textAlign);

        return;
    }

    if (imageSize) {
        drawImage(ctx, $image!, 0, 0, imageSize.width, imageSize.height);
    }

    if (content.length) {
        drawText(ctx, content, 0, 0, textWidth, textStyle.lineHeight, textStyle.textAlign);
    }
};

export const drawToDataUrl = (params: RenderParams, $image?: HTMLImageElement) => {
    const { pattern, textStyle } = params;
    const $canvas = document.createElement('canvas');
    const ctx = $canvas.getContext('2d');

    if (!ctx) {
        return { dataUrl: null };
    }

    ctx.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize}px ${textStyle.fontFamily}`;
    const layout = getLayout(ctx, params, $image);
    const rotatedSize = getRotatedSize(layout.width, layout.height, pattern.rotate);
    const tileWidth = rotatedSize.width + pattern.gap[0];
    const tileHeight = rotatedSize.height + pattern.gap[1];
    // canvas memory grows with DPR squared; capping at 2 keeps tiles crisp without oversized allocations.
    const dpr = Math.min(getDPR() || 1, 2);

    $canvas.width = Math.round(tileWidth * dpr);
    $canvas.height = Math.round(tileHeight * dpr);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, tileWidth, tileHeight);
    ctx.save();
    ctx.translate(rotatedSize.width / 2, rotatedSize.height / 2);
    ctx.rotate((pattern.rotate * Math.PI) / 180);
    ctx.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize}px ${textStyle.fontFamily}`;
    ctx.fillStyle = textStyle.color;
    ctx.textAlign = textStyle.textAlign;
    ctx.textBaseline = 'alphabetic';
    drawContent(ctx, params, layout, $image);
    ctx.restore();

    return {
        dataUrl: $canvas.toDataURL(),
        width: tileWidth,
        height: tileHeight,
    };
};

export const createTile = async (params: RenderParams): Promise<RenderResult> => {
    if (!params.content.length && !params.image) {
        return { dataUrl: null };
    }

    if (!params.image) {
        return drawToDataUrl(params);
    }

    const createError = (error: unknown): RenderResult => {
        const normalizedError = error instanceof Event || error instanceof Error ? error : new Error(String(error));

        return params.content.length
            ? {
                  ...drawToDataUrl({ ...params, image: undefined }),
                  error: normalizedError,
                  image: params.image,
              }
            : { dataUrl: null, error: normalizedError, image: params.image };
    };

    try {
        const $image = await loadImage(params.image);

        try {
            return drawToDataUrl(params, $image);
        } catch (error) {
            return createError(error);
        }
    } catch (error) {
        return createError(error);
    }
};
