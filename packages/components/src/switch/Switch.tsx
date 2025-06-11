import { useControllableState } from '@nild/hooks';
import { CSSPropertiesWithVars } from '@nild/shared/interfaces';
import { cnMerge } from '@nild/shared/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { DISABLED_CLS } from '../_shared/style';
import {
    SwitchVariant,
    SwitchSize,
    SwitchShape,
    VARIANT_CLS_MAP,
    VARIANT_TRACK_CLS_MAP,
    VARIANT_THUMB_CLS_MAP,
    SIZE_VAR_MAP,
    SIZE_CLS_MAP,
    SHAPE_CLS_MAP,
} from './style';

export interface SwitchProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
    className?: string;
    variant?: SwitchVariant;
    size?: SwitchSize;
    shape?: SwitchShape;
    checked?: boolean;
    defaultChecked?: boolean;
    value?: boolean;
    defaultValue?: boolean;
    disabled?: boolean;
    checkedContent?: React.ReactNode;
    uncheckedContent?: React.ReactNode;
    thumbContent?: React.ReactNode;
    onChange?: (checked: boolean) => void;
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
    (
        {
            className,
            variant = 'solid',
            size = 'medium',
            shape = 'round',
            checked: checkedProp,
            defaultChecked,
            value: valueProp,
            defaultValue,
            disabled,
            checkedContent,
            uncheckedContent,
            thumbContent,
            onChange,
            style: styleProp,
            ...restProps
        },
        ref,
    ) => {
        const style: CSSPropertiesWithVars = {
            '--nd-switch-height': SIZE_VAR_MAP[size],
        };
        const [checked, setChecked] = useControllableState(
            checkedProp ?? valueProp,
            defaultChecked ?? defaultValue ?? false,
        );

        const handleClick = () => {
            setChecked(checked => {
                onChange?.(!checked);

                return !checked;
            });
        };

        return (
            <button
                {...restProps}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                className={cnMerge(
                    'nd-switch',
                    ['relative', 'inline-block', 'font-sans', 'overflow-hidden', 'cursor-pointer'],
                    ['h-[var(--nd-switch-height)]'],
                    DISABLED_CLS,
                    VARIANT_CLS_MAP[variant],
                    SIZE_CLS_MAP[size],
                    SHAPE_CLS_MAP[shape],
                    className,
                )}
                style={{ ...style, ...styleProp }}
                ref={ref}
                onClick={handleClick}
            >
                <div
                    className={cnMerge(
                        'h-[var(--nd-switch-height)] flex justify-center items-center',
                        'text-center text-contrast',
                        'ps-[calc(var(--nd-switch-height)/3)] pe-[calc(var(--nd-switch-height)*1.1)]',
                        'transition-[margin-inline,background-color]',
                        VARIANT_TRACK_CLS_MAP[variant][`${checked}`].concat(
                            checked ? ['ms-0 me-0'] : ['-ms-[100%] me-[100%]'],
                        ),
                    )}
                >
                    {checkedContent}
                </div>
                <div
                    className={cnMerge(
                        'h-[var(--nd-switch-height)] flex justify-center items-center',
                        'text-center text-contrast',
                        '-mt-[var(--nd-switch-height)]',
                        'ps-[calc(var(--nd-switch-height)*1.1)] pe-[calc(var(--nd-switch-height)/3)]',
                        'transition-[margin-inline,background-color]',
                        VARIANT_TRACK_CLS_MAP[variant][`${checked}`].concat(
                            checked ? ['ms-[100%] -me-[100%]'] : ['ms-0 me-0'],
                        ),
                    )}
                >
                    {uncheckedContent}
                </div>
                <div
                    className={cnMerge(
                        'flex justify-center items-center',
                        'h-[var(--nd-switch-height)] absolute aspect-square scale-80',
                        'text-contrast transition-[left]',
                        VARIANT_THUMB_CLS_MAP[variant],
                        SHAPE_CLS_MAP[shape],
                        checked ? 'left-[calc(100%-var(--nd-switch-height))]' : 'left-0',
                    )}
                >
                    {thumbContent}
                </div>
            </button>
        );
    },
);

Switch.displayName = 'Switch';

export default Switch;
