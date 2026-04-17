import CheckSmall from '@nild/icons/CheckSmall';
import { cnMerge, forwardRefWithGenerics } from '@nild/shared';
import { ForwardedRef, ReactElement, ReactNode, isValidElement } from 'react';
import { SelectOptionProps } from './interfaces';
import variants from './style';

export const isOptionElement = <T,>(child: ReactNode): child is ReactElement<SelectOptionProps<T>> => {
    return isValidElement(child) && child.type === Option;
};

const Option = forwardRefWithGenerics(<T,>(props: SelectOptionProps<T>, ref: ForwardedRef<HTMLDivElement>) => {
    const {
        size = 'medium',
        label,
        disabled = false,
        selected = false,
        active = false,
        children,
        className,
        onClick,
        onMouseDown,
        onMouseEnter,
        ...restProps
    } = props;

    return (
        <div
            {...restProps}
            aria-disabled={disabled || undefined}
            aria-selected={selected}
            className={cnMerge(
                variants.option({
                    size,
                    disabled,
                    active,
                }),
                className,
            )}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            ref={ref}
            role="option"
        >
            <div className={variants.optionContent()}>
                {children ?? <span className={variants.optionLabel()}>{label}</span>}
            </div>
            <span
                aria-hidden="true"
                className={variants.optionIndicator({
                    size,
                })}
            >
                {selected ? <CheckSmall className="text-brand" size="1em" /> : null}
            </span>
        </div>
    );
});

(Option as unknown as { displayName: string }).displayName = 'Select.Option';

export default Option;
