import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { useSegmentContext } from './contexts';
import { ItemProps } from './interfaces';
import variants from './style';

export const isItemElement = <T,>(child: ReactNode): child is ReactElement<ItemProps<T>> => {
    return isValidElement(child) && child.type === Item;
};

const Item = forwardRef<HTMLButtonElement, ItemProps>((props, ref) => {
    const { selected = false, size = 'medium', orientation = 'horizontal', block = false } = useSegmentContext();
    const { className, children, value: _value, disabled = false, ...restProps } = props;

    return (
        <button
            {...restProps}
            aria-checked={selected}
            aria-disabled={disabled}
            className={cnMerge(variants.item({ size, orientation, selected, disabled, block }), className)}
            disabled={disabled}
            ref={ref}
            role="radio"
            type="button"
        >
            {children}
        </button>
    );
});

Item.displayName = 'Segment.Item';

export default Item;
