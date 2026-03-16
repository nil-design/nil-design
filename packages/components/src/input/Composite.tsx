import { cnMerge } from '@nild/shared';
import { forwardRef, cloneElement } from 'react';
import { registerSlots } from '../_shared/utils';
import { isAppendElement } from './Append';
import { CompositeProvider } from './contexts';
import { isInputElement } from './Input';
import { CompositeProps } from './interfaces';
import { isPrependElement } from './Prepend';
import variants from './style';

const collectSlots = registerSlots({
    prepend: { isMatched: isPrependElement },
    input: { isMatched: isInputElement },
    append: { isMatched: isAppendElement },
});

const Composite = forwardRef<HTMLDivElement, CompositeProps>(
    (
        { className, children, variant = 'outlined', size = 'medium', block = false, disabled = false, ...restProps },
        ref,
    ) => {
        const { slots } = collectSlots(children);

        if (!slots.input.el) {
            return null;
        }

        return (
            <CompositeProvider
                value={{
                    variant,
                    size,
                    block,
                    disabled,
                }}
            >
                <span
                    ref={ref}
                    className={cnMerge(
                        variants.composite({
                            block,
                        }),
                        className,
                    )}
                    {...restProps}
                >
                    {slots.prepend.el}
                    {cloneElement(slots.input.el, {
                        ...slots.input.el?.props,
                        className: variants.compositedInputWrapper({
                            variant,
                            prepended: !!slots.prepend.el,
                            appended: !!slots.append.el,
                        }),
                    })}
                    {slots.append.el}
                </span>
            </CompositeProvider>
        );
    },
);

Composite.displayName = 'Input.Composite';

export default Composite;
