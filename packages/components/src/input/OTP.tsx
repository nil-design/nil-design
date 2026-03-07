import { useControllableState } from '@nild/hooks';
import { cnMerge, isEmpty, isFunction, isNumber } from '@nild/shared';
import {
    forwardRef,
    useRef,
    FocusEvent,
    KeyboardEvent,
    ClipboardEvent,
    Fragment,
    SyntheticEvent,
    useImperativeHandle,
} from 'react';
import Input from './Input';
import { OTPProps, OTPRef } from './interfaces';
import { otpInputWrapperClassNames, otpWrapperClassNames } from './style';

const OTP = forwardRef<OTPRef, OTPProps>(
    (
        {
            className,
            placeholder,
            length = 6,
            separator,
            block = false,
            size = 'medium',
            type,
            value: externalValue,
            defaultValue,
            onFocus,
            onBlur,
            onChange,
            onComplete,
            ...restProps
        },
        ref,
    ) => {
        const [chars, setChars] = useControllableState<string[]>(externalValue, defaultValue ?? []);
        const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
        const latestCharsRef = useRef(chars);
        latestCharsRef.current = chars;

        const getLatestChars = () => Array.from({ length }, (_, i) => latestCharsRef.current[i] ?? '');

        const updateChars = (newChars: string[], evt: SyntheticEvent) => {
            latestCharsRef.current = newChars;
            setChars(newChars);
            onChange?.(newChars, evt);
            if (newChars.every(char => !isEmpty(char))) {
                onComplete?.(newChars, evt);
            }
        };

        const handleChange = (index: number, v: string | number, evt: SyntheticEvent) => {
            const strV = String(v ?? '');
            if (!strV) return;

            const newChars = getLatestChars();
            const inputChars = strV.split('');

            for (let i = 0; i < inputChars.length; i++) {
                if (index + i < length) {
                    newChars[index + i] = inputChars[i];
                }
            }
            updateChars(newChars, evt);

            // focus the next
            const nextIndex = Math.min(index + inputChars.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
        };

        const handleFocus = (index: number, evt: FocusEvent<HTMLInputElement>) => {
            const currentChars = getLatestChars();
            const firstEmptyIndex = currentChars.findIndex(c => c === '');

            if (isEmpty(currentChars[index]) && firstEmptyIndex !== -1 && index > firstEmptyIndex) {
                evt.preventDefault();
                inputRefs.current[firstEmptyIndex]?.focus();
            } else {
                evt.target.select();
                onFocus?.(index, evt);
            }
        };

        const handleBlur = (evt: FocusEvent<HTMLSpanElement>) => {
            /**
             * evt.relatedTarget is the element that will get focus
             * if the new focus is not inside the current container, it means a truly left
             */
            if (!evt.currentTarget.contains(evt.relatedTarget as Node)) {
                onBlur?.(evt);
            }
        };

        const handleKeyDown = (index: number, evt: KeyboardEvent<HTMLInputElement>) => {
            if (evt.key === 'Backspace' || evt.keyCode === 8) {
                evt.preventDefault();
                const newChars = getLatestChars();
                if (!isEmpty(newChars[index])) {
                    // clear the current
                    newChars[index] = '';
                    updateChars(newChars, evt);
                } else if (index > 0) {
                    // clear and focus the previous
                    newChars[index - 1] = '';
                    updateChars(newChars, evt);
                    inputRefs.current[index - 1]?.focus();
                }
            } else if (evt.key === 'ArrowLeft') {
                evt.preventDefault();
                inputRefs.current[Math.max(0, index - 1)]?.focus();
            } else if (evt.key === 'ArrowRight') {
                evt.preventDefault();
                inputRefs.current[Math.min(length - 1, index + 1)]?.focus();
            }
        };

        const handlePaste = (evt: ClipboardEvent<HTMLSpanElement>) => {
            evt.preventDefault();
            const rawV = evt.clipboardData?.getData?.('text') ?? '';
            const formattedV = type === 'number' ? rawV.replace(/\D/g, '') : rawV.replace(/\s/g, '');
            if (!formattedV) return;

            const activeIndex = Math.max(
                0,
                inputRefs.current.findIndex(el => el === document.activeElement),
            );
            const newChars = getLatestChars();
            const pastedChars = formattedV.split('');

            // overwrite from the current focused input
            for (let i = 0; i < pastedChars.length; i++) {
                if (activeIndex + i < length) {
                    newChars[activeIndex + i] = pastedChars[i];
                }
            }

            updateChars(newChars, evt);

            const nextIndex = Math.min(activeIndex + pastedChars.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
        };

        useImperativeHandle(ref, () => ({
            focus: (index?: number) => {
                if (isNumber(index)) {
                    inputRefs.current[index]?.focus();
                } else {
                    const currentChars = getLatestChars();
                    const firstEmptyIndex = currentChars.findIndex(c => c === '');
                    const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
                    inputRefs.current[targetIndex]?.focus();
                }
            },
            blur: () => {
                inputRefs.current.forEach(input => input?.blur());
            },
        }));

        return (
            <span
                className={cnMerge(otpWrapperClassNames({ block }), className)}
                /**
                 * Why not use onPaste?
                 *
                 * Intercepting in the capture phase prevents the event from reaching the
                 * underlying <input> first. This avoids a visual flicker where the entire
                 * pasted string temporarily appears inside a single input box before React
                 * distributes it.
                 */
                onPasteCapture={handlePaste}
                onBlur={handleBlur}
            >
                {Array.from({ length }).map((_, index) => (
                    <Fragment key={index}>
                        <Input
                            className={otpInputWrapperClassNames({ block, size })}
                            type={type}
                            size={size}
                            placeholder={placeholder?.[index]}
                            value={chars[index] ?? ''}
                            autoComplete="one-time-code"
                            ref={el => {
                                inputRefs.current[index] = el;
                            }}
                            onChange={(v, evt) => handleChange(index, v, evt)}
                            onFocus={evt => handleFocus(index, evt)}
                            onKeyDown={evt => handleKeyDown(index, evt)}
                            {...restProps}
                        />
                        {index < length - 1 && (isFunction(separator) ? separator(index) : separator)}
                    </Fragment>
                ))}
            </span>
        );
    },
);

OTP.displayName = 'Input.OTP';

export default OTP;
