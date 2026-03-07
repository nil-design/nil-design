import type {
    InputHTMLAttributes,
    HTMLAttributes,
    FocusEvent,
    ChangeEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
} from 'react';

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

export interface OTPRef {
    focus: (index?: number) => void;
    blur: () => void;
}

export interface OTPProps
    extends Omit<HTMLAttributes<HTMLSpanElement>, 'placeholder' | 'onFocus' | 'onChange'>,
        Pick<InputProps, 'variant' | 'type' | 'block' | 'size' | 'disabled'> {
    placeholder?: string[];
    length?: number;
    separator?: ReactNode | ((index: number) => ReactNode);
    value?: string[];
    defaultValue?: string[];
    onFocus?: (index: number, evt: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (evt: FocusEvent<HTMLSpanElement>) => void;
    onChange?: (value: string[], evt: SyntheticEvent) => void;
    onComplete?: (value: string[], evt: SyntheticEvent) => void;
}

export interface NumberProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange'> {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    defaultValue?: number;
    onChange?: (value: number | undefined, evt?: ChangeEvent<HTMLInputElement>) => void;
}
