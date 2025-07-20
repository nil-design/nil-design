import { useControllableState, useEffectCallback } from '@nild/hooks';
import { cnMerge, forwardRefWithGenerics } from '@nild/shared';
import { ForwardedRef } from 'react';
import { GroupProvider } from './contexts';
import { GroupProps } from './interfaces';
import { groupClassNames } from './style';

const Group = forwardRefWithGenerics(
    <T,>(
        {
            className,
            children,
            direction = 'horizontal',
            variant = 'solid',
            size = 'medium',
            disabled = false,
            value: externalValue,
            defaultValue = [],
            onChange,
            ...restProps
        }: GroupProps<T>,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const [value, setValue] = useControllableState<T[]>(externalValue, defaultValue);

        const updateValue = useEffectCallback((value: T[]) => {
            setValue(() => {
                onChange?.(value);

                return value;
            });
        });

        return (
            <GroupProvider value={{ variant, size, disabled, value, setValue: updateValue }}>
                <div {...restProps} className={cnMerge(groupClassNames({ direction }), className)} ref={ref}>
                    {children}
                </div>
            </GroupProvider>
        );
    },
);

(Group as unknown as { displayName: string }).displayName = 'Checkbox.Group';

export default Group;
