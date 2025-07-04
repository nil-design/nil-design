import { useControllableState, useEffectCallback, usePureCallback } from '@nild/hooks';
import { cnMerge, isString } from '@nild/shared';
import {
    HTMLAttributes,
    ForwardRefExoticComponent,
    RefAttributes,
    ReactElement,
    forwardRef,
    Children,
    isValidElement,
    ComponentType,
} from 'react';
import { DISABLED_CLS } from '../_shared/style';

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultValue'> {
    checked?: boolean;
    defaultChecked?: boolean;
    value?: boolean;
    defaultValue?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
}

/**
 * @category Components
 */
const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
    (
        {
            className,
            children: externalChildren,
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
            setChecked(checked => {
                onChange?.(!checked);

                return !checked;
            });
        });

        const renderDefaultIndicator = usePureCallback(() => {
            return <input type="checkbox" checked={checked} onChange={handleChange} />;
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
            children.unshift(renderDefaultIndicator());
        }

        if (!childrenMap.has(Label) && isString(externalChildren)) {
            children.push(<Label>{externalChildren}</Label>);
        }

        return (
            <label
                {...restProps}
                className={cnMerge('nd-checkbox', DISABLED_CLS, disabled && 'disabled', className)}
                ref={ref}
            >
                {children}
            </label>
        );
    },
) as ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLDivElement>> & {
    Indicator: typeof Indicator;
    Label: typeof Label;
};

const Indicator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ children, ...restProps }, ref) => {
    return (
        <div {...restProps} ref={ref}>
            {children}
        </div>
    );
});

Indicator.displayName = 'Checkbox.Indicator';

const Label = forwardRef<HTMLLabelElement, HTMLAttributes<HTMLLabelElement>>(({ children, ...restProps }, ref) => {
    return (
        <span {...restProps} ref={ref}>
            {children}
        </span>
    );
});

Label.displayName = 'Checkbox.Label';

Checkbox.Indicator = Indicator;
Checkbox.Label = Label;
Checkbox.displayName = 'Checkbox';

export default Checkbox;
