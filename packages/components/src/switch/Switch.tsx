import { useControllableState } from '@nild/hooks';
import { CSSPropertiesWithVars, cnMerge } from '@nild/shared';
import { forwardRef, Children, isValidElement, ReactElement } from 'react';
import { SwitchProvider } from './contexts';
import { SwitchProps, TrackType } from './interfaces';
import { switchClassNames } from './style';
import Thumb from './Thumb';
import Track from './Track';

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
        let checkedTrackChild: ReactElement | undefined;
        let uncheckedTrackChild: ReactElement | undefined;
        let thumbChild: ReactElement | undefined;

        Children.forEach(children, child => {
            if (isValidElement(child)) {
                if (child.type === Track) {
                    const trackType: TrackType = child.props.type;
                    if (trackType === 'checked') {
                        checkedTrackChild = child;
                    } else {
                        uncheckedTrackChild = child;
                    }
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
            <SwitchProvider value={{ variant, shape, checked }}>
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
                    {checkedTrackChild ? checkedTrackChild : <Track type="checked" />}
                    {uncheckedTrackChild ? uncheckedTrackChild : <Track type="unchecked" />}
                    {thumbChild ? thumbChild : <Thumb />}
                </button>
            </SwitchProvider>
        );
    },
);

Switch.displayName = 'Switch';

export default Switch;
