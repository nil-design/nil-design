import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { TypographyProps } from './interfaces';
import variants from './style';

const Typography = forwardRef<HTMLElement, TypographyProps>(({ className, children, ...restProps }, ref) => {
    return (
        <article {...restProps} className={cnMerge(variants.typography(), className)} ref={ref}>
            {children}
        </article>
    );
});

Typography.displayName = 'Typography';

export default Typography;
