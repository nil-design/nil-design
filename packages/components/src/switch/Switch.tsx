import { useControllableState } from '@nild/hooks';
import { CSSPropertiesWithVars, cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { registerSlots } from '../_shared/utils';
import { SwitchProvider } from './contexts';
import { SwitchProps } from './interfaces';
import variants from './style';
import Thumb from './Thumb';
import Track from './Track';

const collectSlots = registerSlots({
    checkedTrack: { isMatched: child => child.type === Track && child.props.type === 'checked' },
    uncheckedTrack: { isMatched: child => child.type === Track && child.props.type === 'unchecked' },
    thumb: { isMatched: child => child.type === Thumb },
});

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
        const { slots } = collectSlots(children);
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
            <SwitchProvider value={{ variant, shape, checked }}>
                <button
                    {...restProps}
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    disabled={disabled}
                    className={cnMerge(
                        variants.switch({
                            variant,
                            size,
                            shape,
                            checked,
                        }),
                        className,
                    )}
                    style={{ ...style, ...externalStyle }}
                    ref={ref}
                    onClick={handleClick}
                >
                    {slots.checkedTrack.el ?? <Track type="checked" />}
                    {slots.uncheckedTrack.el ?? <Track type="unchecked" />}
                    {slots.thumb.el ?? <Thumb />}
                </button>
            </SwitchProvider>
        );
    },
);

Switch.displayName = 'Switch';

export default Switch;
