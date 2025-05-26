import clsx from 'clsx';
import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { isEmptyChildren } from '../_core/utils';
import {
    DividerVariant,
    DividerDirection,
    DividerAlign,
    directionWithoutChildrenClassNames,
    directionWithChildrenClassNames,
    alignClassNames,
} from './style';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: ReactNode;
    variant?: DividerVariant;
    direction?: DividerDirection;
    align?: DividerAlign;
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
    ({ className, children, variant = 'solid', direction = 'horizontal', align = 'center', ...restProps }, ref) => {
        const horizontal = direction === 'horizontal';
        const hasChildren = !isEmptyChildren(children);

        return (
            <div
                {...restProps}
                className={clsx(
                    'nd-divider',
                    'nd-border-split',
                    'nd-text-primary',
                    horizontal && hasChildren
                        ? directionWithChildrenClassNames[direction][variant].concat(alignClassNames[align])
                        : directionWithoutChildrenClassNames[direction][variant],
                    className,
                )}
                ref={ref}
            >
                {children}
            </div>
        );
    },
);

Divider.displayName = 'Divider';

export default Divider;
