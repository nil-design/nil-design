import { useControllableState, useEffectCallback } from '@nild/hooks';
import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { registerSlots } from '../_shared/utils';
import { RadioProvider, useGroupContext } from './contexts';
import Indicator from './Indicator';
import { RadioProps } from './interfaces';
import Label from './Label';
import variants from './style';

const collectSlots = registerSlots({
    indicator: { isMatched: child => child.type === Indicator },
    label: { isMatched: child => child.type === Label },
});

const Radio = forwardRef<HTMLLabelElement, RadioProps>((props, ref) => {
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
    const { slots, plainChildren } = collectSlots(externalChildren);
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

    const indicatorChild = slots.indicator.el ?? <Indicator />;
    const labelChild = slots.label.el ?? (plainChildren.length > 0 ? <Label>{plainChildren[0].content}</Label> : null);
    const labelSeq = slots.label.el ? slots.label.seq : (plainChildren[0]?.seq ?? -1);
    const labelFirst = !!slots.indicator.el && !!labelChild && labelSeq < slots.indicator.seq;

    return (
        <RadioProvider value={{ variant, size, checked, setChecked: updateChecked }}>
            <label {...restProps} className={cnMerge(variants.radio({ size, disabled }), className)} ref={ref}>
                {labelFirst ? labelChild : indicatorChild}
                {labelFirst ? indicatorChild : labelChild}
            </label>
        </RadioProvider>
    );
});

Radio.displayName = 'Radio';

export default Radio;
