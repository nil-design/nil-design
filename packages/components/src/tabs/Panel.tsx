import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { useTabsContext } from './contexts';
import { PanelProps } from './interfaces';
import variants from './style';

export const isPanelElement = <T,>(child: ReactNode): child is ReactElement<PanelProps<T>> => {
    return isValidElement(child) && child.type === Panel;
};

const Panel = forwardRef<HTMLDivElement, PanelProps>((props, ref) => {
    const { variant = 'line', orientation = 'horizontal', selectedValue } = useTabsContext();
    const { className, children, hidden, value, ...restProps } = props;
    const selected = Object.is(value, selectedValue);

    return (
        <div
            {...restProps}
            className={cnMerge(variants.panel({ variant, orientation }), className)}
            hidden={hidden || !selected}
            ref={ref}
            role="tabpanel"
            tabIndex={0}
        >
            {children}
        </div>
    );
});

Panel.displayName = 'Tabs.Panel';

export default Panel;
