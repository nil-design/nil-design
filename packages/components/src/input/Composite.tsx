import { cnMerge } from '@nild/shared';
import { forwardRef, Children, ReactElement, cloneElement } from 'react';
import { isAppendElement } from './Append';
import { CompositeProvider } from './contexts';
import { isInputElement } from './Input';
import { CompositeProps } from './interfaces';
import { isPrependElement } from './Prepend';
import { compositeClassNames, compositedInputWrapperClassNames } from './style';

const Composite = forwardRef<HTMLDivElement, CompositeProps>(
    (
        { className, children, variant = 'outlined', size = 'medium', block = false, disabled = false, ...restProps },
        ref,
    ) => {
        let prependChild: ReactElement | undefined;
        let appendChild: ReactElement | undefined;
        let inputChild: ReactElement | undefined;

        Children.forEach(children, child => {
            if (isPrependElement(child)) {
                prependChild = child;
            } else if (isAppendElement(child)) {
                appendChild = child;
            } else if (isInputElement(child)) {
                inputChild = child;
            }
        });

        if (!inputChild) {
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
                        compositeClassNames({
                            block,
                        }),
                        className,
                    )}
                    {...restProps}
                >
                    {prependChild}
                    {cloneElement(inputChild, {
                        ...inputChild?.props,
                        className: compositedInputWrapperClassNames({
                            prepended: !!prependChild,
                            appended: !!appendChild,
                        }),
                    })}
                    {appendChild}
                </span>
            </CompositeProvider>
        );
    },
);

Composite.displayName = 'Input.Composite';

export default Composite;
