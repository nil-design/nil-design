import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type SwitchVariant = 'solid' | 'outlined';
export type SwitchSize = 'small' | 'medium' | 'large';
export type SwitchShape = 'round' | 'square';

export interface SwitchProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
    variant?: SwitchVariant;
    size?: SwitchSize;
    shape?: SwitchShape;
    checked?: boolean;
    defaultChecked?: boolean;
    value?: boolean;
    defaultValue?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
}

export type TrackType = 'checked' | 'unchecked';

export interface TrackProps extends HTMLAttributes<HTMLDivElement> {
    type: TrackType;
}

export interface ThumbProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: (checked: boolean) => ReactNode;
}
