import { useControllableState } from '@nild/hooks';
import { Icon } from '@nild/icons';
import Minus from '@nild/icons/Minus';
import Plus from '@nild/icons/Plus';
import { isNumeric, isUndefined } from '@nild/shared';
import { ChangeEvent, forwardRef } from 'react';
import Button from '../button';
import Append from './Append';
import Composite from './Composite';
import Input from './Input';
import { NumberProps } from './interfaces';
import Prepend from './Prepend';

const Number = forwardRef<HTMLInputElement, NumberProps>(
    (
        { min = -Infinity, max = Infinity, step = 1, value: externalValue, defaultValue, onChange, ...restProps },
        ref,
    ) => {
        const [value, setValue] = useControllableState<number | undefined>(externalValue, defaultValue);
        const minusDisabled = !isUndefined(value) && value <= min;
        const plusDisabled = !isUndefined(value) && value >= max;

        const handleChange = (v: string | number, evt: ChangeEvent<HTMLInputElement>) => {
            const newValue = isNumeric(v) ? globalThis.Number(v) : undefined;

            setValue(newValue);
            onChange?.(newValue, evt);
        };

        const handleStep = (delta: number) => {
            let nextValue = (value ?? 0) + delta;

            if (nextValue < min) nextValue = min;
            if (nextValue > max) nextValue = max;

            setValue(nextValue);
            onChange?.(nextValue);
        };

        return (
            <Composite>
                <Prepend>
                    <Button variant="outlined" disabled={minusDisabled} onClick={() => handleStep(-step)}>
                        <Icon component={Minus} />
                    </Button>
                </Prepend>
                <Input ref={ref} type="number" value={value} onChange={handleChange} {...restProps} />
                <Append>
                    <Button variant="outlined" disabled={plusDisabled} onClick={() => handleStep(step)}>
                        <Icon component={Plus} />
                    </Button>
                </Append>
            </Composite>
        );
    },
);

Number.displayName = 'Input.Number';

export default Number;
