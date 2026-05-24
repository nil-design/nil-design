import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { useTabsContext } from './contexts';
import { ListProps } from './interfaces';
import variants from './style';

export const isListElement = (child: ReactNode): child is ReactElement<ListProps> => {
    return isValidElement(child) && child.type === List;
};

const List = forwardRef<HTMLDivElement, ListProps>((props, ref) => {
    const { variant = 'line', orientation = 'horizontal' } = useTabsContext();
    const { className, children, ...restProps } = props;

    return (
        <div {...restProps} className={cnMerge(variants.list({ variant, orientation }), className)} ref={ref}>
            {children}
        </div>
    );
});

List.displayName = 'Tabs.List';

export default List;
