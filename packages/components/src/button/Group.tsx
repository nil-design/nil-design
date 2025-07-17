import { cnMerge, isEmpty } from '@nild/shared';
import { Children, cloneElement, forwardRef } from 'react';
import { isButtonElement } from './Button';
import { GroupProvider } from './contexts';
import { GroupProps } from './interfaces';
import { groupButtonClassNames, groupClassNames } from './style';

const Group = forwardRef<HTMLDivElement, GroupProps>(
    (
        {
            className,
            children: externalChildren,
            variant = 'solid',
            size = 'medium',
            equal = false,
            disabled,
            direction = 'horizontal',
            ...restProps
        },
        ref,
    ) => {
        const children = Children.toArray(externalChildren);

        if (isEmpty(children)) {
            return null;
        }

        const buttonChildren = children.filter(isButtonElement);

        return (
            <GroupProvider value={{ variant, size, equal, disabled }}>
                {buttonChildren.length === 1 && buttonChildren[0]}
                {buttonChildren.length > 1 && (
                    <div {...restProps} className={cnMerge(groupClassNames({ direction }), className)} ref={ref}>
                        {buttonChildren.map((child, index) =>
                            cloneElement(child, {
                                ...child.props,
                                className: groupButtonClassNames({
                                    first: index === 0,
                                    last: index === buttonChildren.length - 1,
                                    direction,
                                    variant,
                                }),
                            }),
                        )}
                    </div>
                )}
            </GroupProvider>
        );
    },
);

Group.displayName = 'Button.Group';

export default Group;
