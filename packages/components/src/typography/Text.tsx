import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { TextProps } from './interfaces';
import { textClassNames, textTagClassNames } from './style';

const Text = forwardRef<HTMLSpanElement, TextProps>(
    ({ className, children: externalChildren, tags = [], secondary = false, disabled = false, ...restProps }, ref) => {
        const children = [...new Set(tags)].reduce(
            (children, Tag) => <Tag className={textTagClassNames({ tag: Tag })}>{children}</Tag>,
            externalChildren,
        );

        return (
            <span {...restProps} className={cnMerge(textClassNames({ secondary, disabled }), className)} ref={ref}>
                {children}
            </span>
        );
    },
);

Text.displayName = 'Typography.Text';

export default Text;
