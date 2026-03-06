import type { InputHTMLAttributes, HTMLAttributes, ChangeEvent, ReactElement } from 'react';

export type InputVariant = 'outlined' | 'filled';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
    variant?: InputVariant;
    size?: InputSize;
    block?: boolean;
    disabled?: boolean;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (value: string | number, evt: ChangeEvent<HTMLInputElement>) => void;
}

export type PrefixProps = HTMLAttributes<HTMLSpanElement>;
export type SuffixProps = HTMLAttributes<HTMLSpanElement>;

export type PrependProps = HTMLAttributes<HTMLDivElement>;
export type AppendProps = HTMLAttributes<HTMLDivElement>;

export interface CompositeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: InputVariant;
    size?: InputSize;
    disabled?: boolean;
    block?: boolean;
    children?:
        | ReactElement<PrependProps | InputProps | AppendProps>
        | Array<ReactElement<PrependProps | InputProps | AppendProps>>;
}

export interface SearchProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange'> {
    value?: string;
    defaultValue?: string;
    keyword?: string;
    defaultKeyword?: string;
    onChange?: (value: string, evt: ChangeEvent<HTMLInputElement>) => void;
    onSearch?: (value: string) => void;
}

export interface PasswordProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange'> {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string, evt: ChangeEvent<HTMLInputElement>) => void;
    visible?: boolean;
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
}

export interface OTPProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange'> {
    length?: number;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string, evt: ChangeEvent<HTMLInputElement>) => void;
    onComplete?: (value: string) => void;
}

export interface NumberProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange'> {
    value?: number;
    defaultValue?: number;
    onChange?: (value: number | undefined, evt?: ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
    step?: number;
}
