import { useEffectCallback } from '@nild/hooks';
import { cnMerge } from '@nild/shared';
import { FormEvent, forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { registerSlots } from '../_shared/utils';
import { isFieldElement } from '../field/Field';
import { getByPath, updateByPath } from './_shared/path';
import { isActionsElement } from './Actions';
import { FormProvider, hasIssues } from './contexts';
import { useFormIssues } from './hooks/useFormIssues';
import { FormProps, FormValue, ValidateTrigger } from './interfaces';
import variants from './style';

const isTriggerEnabled = (validateTrigger: ValidateTrigger | ValidateTrigger[], trigger: ValidateTrigger) => {
    return Array.isArray(validateTrigger) ? validateTrigger.includes(trigger) : validateTrigger === trigger;
};

const collectSlots = registerSlots({
    field: { isMatched: isFieldElement, multiple: true },
    actions: { isMatched: isActionsElement },
});

const Form = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
    const {
        className,
        children,
        defaultValue = {},
        resolver,
        validateTrigger = ['submit', 'change'],
        onChange,
        onInvalid,
        onSubmit,
        disabled = false,
        ...restProps
    } = props;
    const [formValue, setFormValue] = useState<FormValue>(defaultValue);
    const { errors, warnings, getMeta, touch, touchAll, validateValue } = useFormIssues({
        resolver,
    });
    const formValueRef = useRef(formValue);

    formValueRef.current = formValue;

    const setValue = useEffectCallback((name: string, value: unknown) => {
        const nextValue = updateByPath(formValueRef.current, name, value);

        if (nextValue === formValueRef.current) {
            return;
        }

        setFormValue(nextValue);
        formValueRef.current = nextValue;
        touch(name);
        onChange?.(nextValue);

        if (isTriggerEnabled(validateTrigger, 'change')) {
            void validateValue(nextValue, name);
        }
    });

    const getValue = useCallback((name: string) => getByPath(formValue, name), [formValue]);

    const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if (disabled) {
            return;
        }

        const currentValue = formValueRef.current;
        const result = isTriggerEnabled(validateTrigger, 'submit')
            ? await validateValue(currentValue)
            : { value: currentValue, errors, warnings };

        if (!result) {
            return;
        }

        const resolvedValue = result.value ?? currentValue;
        const resolvedErrors = result.errors ?? {};

        if (result.value) {
            formValueRef.current = result.value;
            setFormValue(result.value);
        }

        if (hasIssues(resolvedErrors)) {
            touchAll(resolvedValue, resolvedErrors);
            onInvalid?.(resolvedErrors, resolvedValue, evt);

            return;
        }

        await onSubmit?.(resolvedValue, evt);
    };

    const context = useMemo(
        () => ({
            disabled,
            getMeta,
            getValue,
            setValue,
        }),
        [disabled, getMeta, getValue, setValue],
    );
    const { slots } = collectSlots(children);

    return (
        <FormProvider value={context}>
            <form
                {...restProps}
                className={cnMerge(variants.form(), className)}
                data-disabled={disabled || undefined}
                ref={ref}
                onSubmit={handleSubmit}
            >
                {slots.field.el}
                {slots.actions.el}
            </form>
        </FormProvider>
    );
});

Form.displayName = 'Form';

export default Form;
