import { useControllableState } from '@nild/hooks';
import { CSSPropertiesWithVars, cnMerge } from '@nild/shared';
import {
    ForwardRefExoticComponent,
    HTMLAttributes,
    RefAttributes,
    forwardRef,
    Children,
    isValidElement,
    ReactElement,
    cloneElement,
} from 'react';
import { SwitchProps, SwitchVariant, SwitchShape } from './interfaces';
import { switchClassNames, checkedClassNames, uncheckedClassNames, thumbClassNames } from './style';

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
            '--nd-switch-height': {
                small: 'calc(var(--spacing) * 4)',
                medium: 'calc(var(--spacing) * 6)',
                large: 'calc(var(--spacing) * 8)',
            }[size],
        };
        const [checked, setChecked] = useControllableState(
            externalChecked ?? externalValue,
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
                    switchClassNames({
                        variant,
                        size,
                        shape,
                    }),
                    className,
                )}
                style={{ ...style, ...externalStyle }}
                ref={ref}
                onClick={handleClick}
            >
                {checkedChild ? (
                    cloneElement(checkedChild, { ...checkedChild.props, variant, checked })
                ) : (
                    <Checked variant={variant} checked={checked} />
                )}
                {uncheckedChild ? (
                    cloneElement(uncheckedChild, { ...uncheckedChild.props, variant, checked })
                ) : (
                    <Unchecked variant={variant} checked={checked} />
                )}
                {thumbChild ? (
                    cloneElement(thumbChild, { ...thumbChild.props, variant, shape, checked })
                ) : (
                    <Thumb variant={variant} shape={shape} checked={checked} />
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

interface CheckedProps extends HTMLAttributes<HTMLDivElement> {
    variant: SwitchVariant;
    checked: boolean;
}

const Checked = forwardRef<HTMLDivElement, CheckedProps>(
    ({ className, children, variant, checked, ...restProps }, ref) => {
        return (
            <div {...restProps} className={cnMerge(checkedClassNames({ variant, checked }), className)} ref={ref}>
                {children}
            </div>
        );
    },
);

Checked.displayName = 'Switch.Checked';

interface UncheckedProps extends HTMLAttributes<HTMLDivElement> {
    variant: SwitchVariant;
    checked: boolean;
}

const Unchecked = forwardRef<HTMLDivElement, UncheckedProps>(
    ({ className, children, variant, checked, ...restProps }, ref) => {
        return (
            <div {...restProps} className={cnMerge(uncheckedClassNames({ variant, checked }), className)} ref={ref}>
                {children}
            </div>
        );
    },
);

Unchecked.displayName = 'Switch.Unchecked';

interface ThumbProps extends HTMLAttributes<HTMLDivElement> {
    variant: SwitchVariant;
    shape: SwitchShape;
    checked: boolean;
}

const Thumb = forwardRef<HTMLDivElement, ThumbProps>(
    ({ className, children, variant, shape, checked, ...restProps }, ref) => {
        return (
            <div {...restProps} className={cnMerge(thumbClassNames({ variant, shape, checked }), className)} ref={ref}>
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
