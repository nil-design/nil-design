import { useControllableState } from '@nild/hooks';
import { CSSPropertiesWithVars, cnJoin, cnMerge } from '@nild/shared';
import {
    ForwardRefExoticComponent,
    ButtonHTMLAttributes,
    HTMLAttributes,
    RefAttributes,
    forwardRef,
    Children,
    isValidElement,
    ReactElement,
    cloneElement,
} from 'react';
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

/**
 * @category Components
 */
const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
    (
        {
            className,
            children,
            variant = 'solid',
            size = 'medium',
            shape = 'round',
            checked: externalChecked,
            defaultChecked,
            value: externalValue,
            defaultValue,
            disabled,
            onChange,
            style: externalStyle,
            ...restProps
        },
        ref,
    ) => {
        let checkedChild: ReactElement | undefined;
        let uncheckedChild: ReactElement | undefined;
        let thumbChild: ReactElement | undefined;

        Children.forEach(children, child => {
            if (isValidElement(child)) {
                if (child.type === Checked) {
                    checkedChild = child;
                } else if (child.type === Unchecked) {
                    uncheckedChild = child;
                } else if (child.type === Thumb) {
                    thumbChild = child;
                }
            }
        });

        const style: CSSPropertiesWithVars = {
            '--nd-switch-height': SIZE_VAR_MAP[size],
        };
        const [checked, setChecked] = useControllableState(
            externalChecked ?? externalValue,
            defaultChecked ?? defaultValue ?? false,
        );
        const checkedClassName = cnJoin(
            'h-[var(--nd-switch-height)]',
            'ps-[calc(var(--nd-switch-height)/3)] pe-[calc(var(--nd-switch-height)*1.1)]',
            VARIANT_TRACK_CLS_MAP[variant][`${checked}`].concat(checked ? 'ms-0 me-0' : '-ms-[100%] me-[100%]'),
        );
        const uncheckedClassName = cnJoin(
            'h-[var(--nd-switch-height)]',
            '-mt-[var(--nd-switch-height)]',
            'ps-[calc(var(--nd-switch-height)*1.1)] pe-[calc(var(--nd-switch-height)/3)]',
            VARIANT_TRACK_CLS_MAP[variant][`${checked}`].concat(checked ? 'ms-[100%] -me-[100%]' : 'ms-0 me-0'),
        );
        const thumbClassName = cnJoin(
            'h-[var(--nd-switch-height)]',
            VARIANT_THUMB_CLS_MAP[variant],
            SHAPE_CLS_MAP[shape],
            checked ? 'left-[calc(100%-var(--nd-switch-height))]' : 'left-0',
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
                    'h-[var(--nd-switch-height)]',
                    'group',
                    'relative inline-block font-sans overflow-hidden cursor-pointer',
                    DISABLED_CLS,
                    VARIANT_CLS_MAP[variant],
                    SIZE_CLS_MAP[size],
                    SHAPE_CLS_MAP[shape],
                    className,
                )}
                style={{ ...style, ...externalStyle }}
                ref={ref}
                onClick={handleClick}
            >
                {checkedChild ? (
                    cloneElement(checkedChild, {
                        ...checkedChild.props,
                        className: cnJoin(checkedClassName, checkedChild.props.className),
                    })
                ) : (
                    <Checked className={checkedClassName} />
                )}
                {uncheckedChild ? (
                    cloneElement(uncheckedChild, {
                        ...uncheckedChild.props,
                        className: cnJoin(uncheckedClassName, uncheckedChild.props.className),
                    })
                ) : (
                    <Unchecked className={uncheckedClassName} />
                )}
                {thumbChild ? (
                    cloneElement(thumbChild, {
                        ...thumbChild.props,
                        className: cnJoin(thumbClassName, thumbChild.props.className),
                    })
                ) : (
                    <Thumb className={thumbClassName} />
                )}
            </button>
        );
    },
) as ForwardRefExoticComponent<SwitchProps & RefAttributes<HTMLButtonElement>> & {
    Checked: typeof Checked;
    Unchecked: typeof Unchecked;
    Thumb: typeof Thumb;
};

Switch.displayName = 'Switch';

const Checked = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...restProps }, ref) => {
        return (
            <div
                {...restProps}
                className={cnMerge(
                    'flex justify-center items-center',
                    'text-center text-contrast',
                    'transition-[margin-inline,background-color]',
                    className,
                )}
                ref={ref}
            >
                {children}
            </div>
        );
    },
);

Checked.displayName = 'Switch.Checked';

const Unchecked = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...restProps }, ref) => {
        return (
            <div
                {...restProps}
                className={cnMerge(
                    'flex justify-center items-center',
                    'text-center text-contrast',
                    'transition-[margin-inline,background-color]',
                    className,
                )}
                ref={ref}
            >
                {children}
            </div>
        );
    },
);

Unchecked.displayName = 'Switch.Unchecked';

const Thumb = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...restProps }, ref) => {
        return (
            <div
                {...restProps}
                className={cnMerge(
                    'flex justify-center items-center',
                    'absolute aspect-square scale-80',
                    'text-contrast transition-[left,background-color]',
                    className,
                )}
                ref={ref}
            >
                {children}
            </div>
        );
    },
);

Thumb.displayName = 'Switch.Thumb';

Switch.Checked = Checked;
Switch.Unchecked = Unchecked;
Switch.Thumb = Thumb;

export default Switch;
