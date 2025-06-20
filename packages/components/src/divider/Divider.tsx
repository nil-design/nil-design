import { cnMerge } from '@nild/shared';
import { HTMLAttributes, forwardRef } from 'react';
import { isEmptyChildren } from '../_shared/utils';
import {
    DividerVariant,
    DividerDirection,
    DividerAlign,
    DIRECTION_WITHOUT_CHILDREN_CLS_MAP,
    DIRECTION_WITH_CHILDREN_CLS_MAP,
    ALIGN_CLS_MAP,
} from './style';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
    variant?: DividerVariant;
    direction?: DividerDirection;
    align?: DividerAlign;
}

/**
 * @category Components
 */
const Divider = forwardRef<HTMLDivElement, DividerProps>(
    ({ className, children, variant = 'solid', direction = 'horizontal', align = 'center', ...restProps }, ref) => {
        const horizontal = direction === 'horizontal';
        const hasChildren = !isEmptyChildren(children);

        return (
            <div
                {...restProps}
                className={cnMerge(
                    'nd-divider',
                    'border-split',
                    'text-primary',
                    horizontal && hasChildren
                        ? DIRECTION_WITH_CHILDREN_CLS_MAP[direction][variant].concat(ALIGN_CLS_MAP[align])
                        : DIRECTION_WITHOUT_CHILDREN_CLS_MAP[direction][variant],
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
