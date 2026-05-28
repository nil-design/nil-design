import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, cloneElement, forwardRef, isValidElement } from 'react';
import { mergeHandlers, registerSlots } from '../_shared/utils';
import { useFormContext } from '../form/contexts';
import { FieldProvider } from './contexts';
import { isHelperElement } from './Helper';
import { FieldProps, StatusProps } from './interfaces';
import { isLabelElement } from './Label';
import RequiredIndicator, { isRequiredIndicatorElement } from './RequiredIndicator';
import Status, { isStatusElement } from './Status';
import variants from './style';

type ControlElement = ReactElement<Record<string, unknown>>;

export const isFieldElement = (child: ReactNode): child is ReactElement<FieldProps> => {
    return isValidElement(child) && child.type === Field;
};

const collectSlots = registerSlots({
    label: { isMatched: isLabelElement },
    helper: { isMatched: isHelperElement },
    status: { isMatched: isStatusElement },
    requiredIndicator: { isMatched: isRequiredIndicatorElement },
    control: {
        isMatched: child =>
            !isLabelElement(child) &&
            !isHelperElement(child) &&
            !isStatusElement(child) &&
            !isRequiredIndicatorElement(child),
        strategy: 'first',
    },
});

const Field = forwardRef<HTMLDivElement, FieldProps>((props, ref) => {
    const formContext = useFormContext();
    const {
        className,
        children,
        name,
        required: externalRequired,
        disabled: externalDisabled,
        bind = 'value',
        ...restProps
    } = props;
    const { slots } = collectSlots(children);
    const formMeta = name && formContext ? formContext.getMeta(name) : {};
    const statusSlot = slots.status.el as ReactElement<StatusProps> | null;
    const status = statusSlot?.props.type ?? formMeta.status;
    const required = externalRequired ?? false;
    const disabled = externalDisabled ?? formContext?.disabled ?? false;
    const controlEl = slots.control.el as ControlElement | null;
    const finalControlEl =
        controlEl &&
        cloneElement(controlEl, {
            ...(name && formContext
                ? (() => {
                      const externalHandler =
                          typeof controlEl.props.onChange === 'function'
                              ? (controlEl.props.onChange as (...args: unknown[]) => unknown)
                              : undefined;

                      return {
                          [bind]: formContext.getValue(name),
                          onChange: mergeHandlers(externalHandler, (...args: unknown[]) => {
                              formContext.setValue(name, args[0]);
                          }),
                      };
                  })()
                : {}),
            ...(disabled && controlEl.props.disabled === undefined ? { disabled } : {}),
        });

    return (
        <FieldProvider value={{ status, issue: formMeta.issue, required, disabled }}>
            <div
                {...restProps}
                className={cnMerge(variants.field({ status }), className)}
                data-disabled={disabled || undefined}
                data-status={status}
                ref={ref}
            >
                {slots.label.el && (
                    <div className={variants.labelRow()}>
                        {slots.label.el}
                        {slots.requiredIndicator.el ?? <RequiredIndicator />}
                    </div>
                )}
                {finalControlEl}
                {slots.helper.el}
                {slots.status.el ?? (formMeta.issue ? <Status /> : null)}
            </div>
        </FieldProvider>
    );
});

Field.displayName = 'Field';

export default Field;
