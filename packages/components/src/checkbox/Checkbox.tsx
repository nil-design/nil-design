import { useControllableState, useEffectCallback, usePureCallback } from '@nild/hooks';
import { Icon } from '@nild/icons';
import CheckSmall from '@nild/icons/CheckSmall';
import { cnJoin, cnMerge, isString } from '@nild/shared';
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
import { DISABLED_CLS } from '../_shared/style';
import { CheckboxSize, SIZE_CLS_MAP, INDICATOR_CHECKED_CLS_MAP } from './style';

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange' | 'defaultValue'> {
    size?: CheckboxSize;
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
                <Indicator className={SIZE_CLS_MAP[size].indicator} checked={checked} onChange={handleChange}>
                    <div
                        className={cnJoin(
                            'flex items-center justify-center',
                            'w-full h-full rounded-sm border-solid border-1 border-primary',
                            'transition-[background-color,color]',
                            INDICATOR_CHECKED_CLS_MAP[`${checked}`],
                        )}
                    >
                        <Icon component={CheckSmall} />
                    </div>
                </Indicator>
            );
        });

        const renderDefaultLabel = usePureCallback((children: ReactNode) => {
            return <Label className={SIZE_CLS_MAP[size].label}>{children}</Label>;
        });

        Children.forEach(externalChildren, child => {
            if (isValidElement(child)) {
                if (child.type === Indicator) {
                    childrenMap.delete(Indicator);
                    childrenMap.set(
                        Indicator,
                        cloneElement(child as ReactElement<IndicatorProps>, {
                            ...child.props,
                            className: cnJoin(SIZE_CLS_MAP[size].indicator, child.props.className),
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
                            className: cnJoin(SIZE_CLS_MAP[size].label, child.props.className),
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
            <label
                {...restProps}
                className={cnMerge(
                    'nd-checkbox',
                    'group',
                    'flex items-center',
                    'cursor-pointer',
                    SIZE_CLS_MAP[size].wrapper,
                    DISABLED_CLS,
                    disabled && 'disabled',
                    className,
                )}
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

interface IndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    checked?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(
    ({ className, children, checked, onChange, ...restProps }, ref) => {
        return (
            <div
                {...restProps}
                className={cnMerge('relative', 'flex items-center justify-center', className)}
                ref={ref}
            >
                {children}
                <input
                    type="checkbox"
                    className={cnJoin(
                        'absolute inset-0 opacity-0',
                        'group-enabled:cursor-pointer',
                        'group-disabled:cursor-not-allowed',
                    )}
                    checked={checked}
                    onChange={onChange}
                />
            </div>
        );
    },
);

Indicator.displayName = 'Checkbox.Indicator';

type LabelProps = HTMLAttributes<HTMLSpanElement>;

const Label = forwardRef<HTMLSpanElement, LabelProps>(({ children, ...restProps }, ref) => {
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
