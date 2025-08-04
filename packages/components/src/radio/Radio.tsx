import { useControllableState, useEffectCallback } from '@nild/hooks';
import { cnMerge, isString } from '@nild/shared';
import { ReactElement, ComponentType, Children, isValidElement, forwardRef, cloneElement } from 'react';
import { RadioProvider, useGroupContext } from './contexts';
import Indicator from './Indicator';
import { RadioProps } from './interfaces';
import Label from './Label';
import { radioClassNames } from './style';

const Radio = forwardRef<HTMLLabelElement, RadioProps>((props, ref) => {
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
        !groupContext ? externalChecked : groupContext.value === value,
        defaultChecked ?? false,
    );

    const updateChecked = useEffectCallback(() => {
        if (disabled) return;
        setChecked(checked => {
            if (checked) return checked;

            if (!groupContext) {
                onChange?.(!checked);
            } else {
                groupContext.setValue(value);
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

    return (
        <RadioProvider value={{ variant, size, checked, setChecked: updateChecked }}>
            <label {...restProps} className={cnMerge(radioClassNames({ size, disabled }), className)} ref={ref}>
                {children.map(child =>
                    cloneElement(child, {
                        key: (child.type as typeof Indicator | typeof Label).displayName,
                        ...child.props,
                    }),
                )}
            </label>
        </RadioProvider>
    );
});

Radio.displayName = 'Radio';

export default Radio;
