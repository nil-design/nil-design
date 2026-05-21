import { HTMLAttributes } from 'react';

export type WatermarkComposition = 'stack' | 'inline' | 'overlay';

export type WatermarkGap = number | [number, number];
export type WatermarkOffset = number | [number, number];
export type WatermarkImageCrossOrigin = '' | 'anonymous' | 'use-credentials';
export type WatermarkTamperType = 'removed' | 'reordered' | 'attribute';
export type WatermarkTamperAttribute = 'aria-hidden' | 'class' | 'hidden' | 'style';

export interface WatermarkTamperEvent {
    type: WatermarkTamperType;
    attributeName?: WatermarkTamperAttribute;
}

export interface WatermarkImage {
    src: string;
    width?: number;
    height?: number;
    scale?: number;
    crossOrigin?: WatermarkImageCrossOrigin;
}

export interface WatermarkPattern {
    gap?: WatermarkGap;
    offset?: WatermarkOffset;
    rotate?: number;
    composition?: WatermarkComposition;
    compositionGap?: number;
}

export interface WatermarkTextStyle {
    fontSize?: number;
    fontWeight?: string | number;
    fontFamily?: string;
    fontStyle?: string;
    lineHeight?: number;
    color?: string;
    textAlign?: CanvasTextAlign;
}

export interface WatermarkProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'onError'> {
    text?: string | string[];
    image?: string | WatermarkImage;
    pattern?: WatermarkPattern;
    textStyle?: WatermarkTextStyle;
    opacity?: number;
    zIndex?: number;
    preserve?: boolean;
    onTamper?: (event: WatermarkTamperEvent) => void;
    onError?: (error: Event | Error, image: WatermarkImage) => void;
}
