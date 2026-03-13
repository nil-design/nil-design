import { createRef, type RefCallback } from 'react';
import forwardRefWithGenerics from '../index';

const Input = forwardRefWithGenerics<HTMLInputElement, { label: string; disabled?: boolean }>((props, ref) => {
    return <input ref={ref} aria-label={props.label} disabled={props.disabled} />;
});

const inputRef = createRef<HTMLInputElement>();
Input({ label: 'username', ref: inputRef, disabled: true });

const callbackRef: RefCallback<HTMLInputElement> = () => {};
Input({ label: 'email', ref: callbackRef });

// @ts-expect-error label is required
Input({ ref: inputRef });

// @ts-expect-error ref type should match HTMLInputElement
Input({ label: 'username', ref: createRef<HTMLDivElement>() });

const Button = forwardRefWithGenerics<HTMLButtonElement, { kind: 'primary' | 'secondary' }>((props, ref) => {
    return <button ref={ref} data-kind={props.kind} />;
});

const buttonRef = createRef<HTMLButtonElement>();
Button({ kind: 'primary', ref: buttonRef });

// @ts-expect-error kind should be limited to declared union values
Button({ kind: 'danger', ref: buttonRef });
