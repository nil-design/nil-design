import { Icon } from '@nild/icons';
import CloseSmall from '@nild/icons/CloseSmall';
import { cnMerge } from '@nild/shared';
import { MouseEvent, ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import Button from '../button';
import { useTabsContext } from './contexts';
import { TabProps } from './interfaces';
import variants from './style';

const CLOSE_ARIA_LABEL = 'Close tab';

export const isTabElement = <T,>(child: ReactNode): child is ReactElement<TabProps<T>> => {
    return isValidElement(child) && child.type === Tab;
};

const Tab = forwardRef<HTMLDivElement, TabProps>((props, ref) => {
    const { variant = 'line', size = 'medium', orientation = 'horizontal', selectedTabId, onClose } = useTabsContext();
    const { className, children, value, disabled = false, closable = false, id, ...restProps } = props;
    const selected = !!id && id === selectedTabId;

    const handleClose = (evt: MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation();
        onClose?.(value, evt);
    };

    return (
        <div
            {...restProps}
            aria-disabled={disabled}
            aria-selected={selected}
            className={cnMerge(variants.tab({ variant, size, orientation, selected, disabled, closable }), className)}
            id={id}
            ref={ref}
            role="tab"
        >
            <span className={variants.tabContent()}>{children}</span>
            {closable && (
                <Button
                    equal
                    variant="text"
                    aria-label={CLOSE_ARIA_LABEL}
                    className={variants.close({ size })}
                    disabled={disabled}
                    onClick={handleClose}
                    onKeyDown={evt => evt.stopPropagation()}
                    tabIndex={-1}
                >
                    <Icon component={CloseSmall} />
                </Button>
            )}
        </div>
    );
});

Tab.displayName = 'Tabs.Tab';

export default Tab;
