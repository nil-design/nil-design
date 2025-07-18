import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { TextProps } from './interfaces';
import { textClassNames, textTagClassNames } from './style';

const Text = forwardRef<HTMLSpanElement, TextProps>(
    (
        { className, children: externalChildren, variants = [], secondary = false, disabled = false, ...restProps },
        ref,
    ) => {
        const children = [...new Set(variants)].reduce((children, variant) => {
            const Tag = variant;

            return <Tag className={textTagClassNames({ variant })}>{children}</Tag>;
        }, externalChildren);

        return (
            <span {...restProps} className={cnMerge(textClassNames({ secondary, disabled }), className)} ref={ref}>
                {children}
            </span>
        );
    },
);

Text.displayName = 'Typography.Text';

export default Text;
