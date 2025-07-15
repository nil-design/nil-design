import { HTMLAttributes } from 'react';

export type CheckboxVariant = 'solid' | 'outlined';
export type CheckboxSize = 'small' | 'medium' | 'large';

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultValue'> {
    variant?: CheckboxVariant;
    size?: CheckboxSize;
    checked?: boolean;
    defaultChecked?: boolean;
    value?: boolean;
    defaultValue?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
}
