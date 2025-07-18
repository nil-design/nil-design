import { AnchorHTMLAttributes, HTMLAttributes } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    underlined?: boolean;
    disabled?: boolean;
}

export type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;

export type TextVariant = 'strong' | 'del' | 'u' | 'i' | 'mark' | 'code' | 'kbd';

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
    variants?: TextVariant[];
    secondary?: boolean;
    disabled?: boolean;
}

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    level?: TitleLevel;
}

export type TypographyProps = HTMLAttributes<HTMLElement>;
