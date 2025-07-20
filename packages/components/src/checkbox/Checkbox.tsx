import { useControllableState, useEffectCallback } from '@nild/hooks';
import { cnMerge, isString } from '@nild/shared';
import { ReactElement, ComponentType, Children, isValidElement, forwardRef } from 'react';
import { CheckboxProvider, useGroupContext } from './contexts';
import Indicator from './Indicator';
import { CheckboxProps } from './interfaces';
import Label from './Label';
import { checkboxClassNames } from './style';

const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>((props, ref) => {
    const children: ReactElement[] = [];
    const childrenMap = new Map<ComponentType, ReactElement>();
    const groupContext = useGroupContext();
    const {
        className,
        children: externalChildren,
        variant = groupContext?.variant ?? 'solid',
        size = groupContext?.size ?? 'medium',
        disabled = groupContext?.disabled ?? false,
        checked: externalChecked,
        defaultChecked,
        value,
        onChange,
        ...restProps
    } = props;
    const [checked, setChecked] = useControllableState(
        !groupContext ? externalChecked : groupContext.value.includes(value),
        defaultChecked ?? false,
    );

    const handleChange = useEffectCallback(() => {
        if (disabled) return;
        setChecked(checked => {
            if (!groupContext) {
                onChange?.(!checked);
            } else {
                groupContext.setValue(
                    !checked ? groupContext.value.concat(value) : groupContext.value.filter(v => v !== value),
                );
            }

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
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
