import { useControllableState, useEffectCallback } from '@nild/hooks';
import { cnMerge, isString } from '@nild/shared';
import { ReactElement, ComponentType, forwardRef, Children, isValidElement } from 'react';
import { CheckboxProvider } from './contexts';
import Indicator from './Indicator';
import { CheckboxProps } from './interfaces';
import Label from './Label';
import { checkboxClassNames } from './style';

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

        Children.forEach(externalChildren, child => {
            if (isValidElement(child)) {
                if (child.type === Indicator) {
                    childrenMap.delete(Indicator);
                    childrenMap.set(Indicator, child);
                } else if (child.type === Label) {
                    childrenMap.delete(Label);
                    childrenMap.set(Label, child);
                }
            } else if (isString(child)) {
                if (!childrenMap.has(Label)) {
                    childrenMap.set(Label, <Label>{child}</Label>);
                }
            }
        });

        children.push(...childrenMap.values());

        if (!childrenMap.has(Indicator)) {
            children.unshift(<Indicator />);
        }

        if (!childrenMap.has(Label) && isString(externalChildren)) {
            children.push(<Label>{externalChildren}</Label>);
        }

        return (
            <CheckboxProvider value={{ variant, size, checked, handleChange }}>
                <label {...restProps} className={cnMerge(checkboxClassNames({ size, disabled }), className)} ref={ref}>
                    {children}
                </label>
            </CheckboxProvider>
        );
    },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
