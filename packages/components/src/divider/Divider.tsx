import { cnMerge, isEmpty } from '@nild/shared';
import { Children, forwardRef } from 'react';
import { DividerProps } from './interfaces';
import { dividerClassNames } from './style';

/**
 * @category Components
 */
const Divider = forwardRef<HTMLDivElement, DividerProps>(
    (
        {
            className,
            children: externalChildren,
            variant = 'solid',
            direction = 'horizontal',
            align = 'center',
            ...restProps
        },
        ref,
    ) => {
        const children = Children.toArray(externalChildren);

        return (
            <div
                {...restProps}
                className={cnMerge(
                    dividerClassNames({
                        emptyChildren: isEmpty(children),
                        variant,
                        direction,
                        align,
                    }),
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
