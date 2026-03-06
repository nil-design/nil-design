import { useControllableState } from '@nild/hooks';
import { cnMerge } from '@nild/shared';
import { forwardRef, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import Input from './Input';
import { OTPProps } from './interfaces';

const OTP = forwardRef<HTMLDivElement, OTPProps>(
    ({ length = 6, onComplete, value: externalValue, defaultValue = '', onChange, className, ...restProps }, ref) => {
        const [value, setValue] = useControllableState<string>(externalValue, defaultValue);
        const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

        useEffect(() => {
            if (value.length === length) {
                onComplete?.(value);
            }
        }, [value, length, onComplete]);

        const focusNext = (index: number) => {
            if (index < length - 1 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]?.focus();
            }
        };

        const focusPrev = (index: number) => {
            if (index > 0 && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1]?.focus();
            }
        };

        const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
            const val = e.target.value.replace(/[^0-9]/g, ''); // Ensure only numbers
            if (!val && val !== '') return;

            const char = val.slice(-1); // Take the last character typed
            const newValue = value.split('');
            newValue[index] = char || ''; // Replace or delete

            const nextString = newValue.join('');

            setValue(nextString);

            // Mock standard onChange event
            const mockEvent = { ...e, target: { ...e.target, value: nextString } } as ChangeEvent<HTMLInputElement>;
            onChange?.(nextString, mockEvent);

            if (char) {
                focusNext(index);
            }
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
            if (e.key === 'Backspace' && !value[index]) {
                focusPrev(index);
            }
        };

        const renderBoxes = () => {
            const boxes = [];
            for (let i = 0; i < length; i++) {
                boxes.push(
                    <Input
                        key={i}
                        ref={el => {
                            inputRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[i] || ''}
                        onChange={(_v, e) => handleChange(e, i)}
                        onKeyDown={e => handleKeyDown(e, i)}
                        className="w-10 h-10 text-center"
                        {...restProps}
                    />,
                );
            }

            return boxes;
        };

        return (
            <div ref={ref} className={cnMerge('flex gap-2 items-center', className)}>
                {renderBoxes()}
            </div>
        );
    },
);

OTP.displayName = 'Input.OTP';

export default OTP;
