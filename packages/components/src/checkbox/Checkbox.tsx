import { useControllableState, useEffectCallback, usePureCallback } from '@nild/hooks';
import { Icon } from '@nild/icons';
import CheckSmall from '@nild/icons/CheckSmall';
import { cnMerge, isString } from '@nild/shared';
import {
    HTMLAttributes,
    ForwardRefExoticComponent,
    RefAttributes,
    ReactElement,
    ReactNode,
    ComponentType,
    ChangeEventHandler,
    forwardRef,
    Children,
    isValidElement,
    cloneElement,
} from 'react';
import { CheckboxProps, CheckboxSize } from './interfaces';
import {
    checkboxClassNames,
    indicatorWrapperClassNames,
    indicatorInputClassNames,
    labelClassNames,
    defaultIndicatorClassNames,
    defaultIndicatorIconClassNames,
} from './style';

/**
 * @category Components
 */
const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
    (
        {
            className,
            children: externalChildren,
            variant = 'solid',
            size = 'medium',
            checked: externalChecked,
            defaultChecked,
            value: externalValue,
            defaultValue,
            indeterminate,
            disabled,
            onChange,
            ...restProps
        },
        ref,
    ) => {
        const children: ReactElement[] = [];
        const childrenMap = new Map<ComponentType, ReactElement>();
        const [checked, setChecked] = useControllableState(
            externalChecked ?? externalValue,
            defaultChecked ?? defaultValue ?? false,
        );

        const handleChange = useEffectCallback(() => {
            if (disabled) return;
            setChecked(checked => {
                onChange?.(!checked);

                return !checked;
            });
        });

        const renderDefaultIndicator = usePureCallback(() => {
            return (
                <Indicator size={size} checked={checked} onChange={handleChange}>
                    <div className={defaultIndicatorClassNames({ variant, checked })}>
                        <Icon className={defaultIndicatorIconClassNames()} component={CheckSmall} />
                    </div>
                </Indicator>
            );
        });

        const renderDefaultLabel = usePureCallback((children: ReactNode) => {
            return <Label size={size}>{children}</Label>;
        });

        Children.forEach(externalChildren, child => {
            if (isValidElement(child)) {
                if (child.type === Indicator) {
                    childrenMap.delete(Indicator);
                    childrenMap.set(
                        Indicator,
                        cloneElement(child as ReactElement<IndicatorProps>, {
                            ...child.props,
                            size,
                            checked,
                            onChange: handleChange,
                        }),
                    );
                } else if (child.type === Label) {
                    childrenMap.delete(Label);
                    childrenMap.set(
                        Label,
                        cloneElement(child as ReactElement<LabelProps>, {
                            ...child.props,
                            size,
                        }),
                    );
                }
            } else if (isString(child)) {
                if (!childrenMap.has(Label)) {
                    childrenMap.set(Label, renderDefaultLabel(child));
                }
            }
        });

        children.push(...childrenMap.values());

        if (!childrenMap.has(Indicator)) {
            children.unshift(renderDefaultIndicator());
        }

        if (!childrenMap.has(Label) && isString(externalChildren)) {
            children.push(renderDefaultLabel(externalChildren));
        }

        return (
            <label {...restProps} className={cnMerge(checkboxClassNames({ size, disabled }), className)} ref={ref}>
                {children}
            </label>
        );
    },
) as ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLDivElement>> & {
    Indicator: typeof Indicator;
    Label: typeof Label;
};

interface IndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    size?: CheckboxSize;
    checked?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(
    ({ className, children, size, checked, onChange, ...restProps }, ref) => {
        return (
            <div {...restProps} className={cnMerge(indicatorWrapperClassNames({ size }), className)} ref={ref}>
                {children}
                <input type="checkbox" className={indicatorInputClassNames()} checked={checked} onChange={onChange} />
            </div>
        );
    },
);

Indicator.displayName = 'Checkbox.Indicator';

interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
    size?: CheckboxSize;
}

const Label = forwardRef<HTMLSpanElement, LabelProps>(({ className, children, size, ...restProps }, ref) => {
    return (
        <span {...restProps} className={cnMerge(labelClassNames({ size }), className)} ref={ref}>
            {children}
        </span>
    );
});

Label.displayName = 'Checkbox.Label';

Checkbox.Indicator = Indicator;
Checkbox.Label = Label;
Checkbox.displayName = 'Checkbox';

export default Checkbox;
