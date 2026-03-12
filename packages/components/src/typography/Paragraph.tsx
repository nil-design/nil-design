import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { ParagraphProps } from './interfaces';
import variants from './style';

const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(({ className, children, ...restProps }, ref) => {
    return (
        <p {...restProps} className={cnMerge(variants.paragraph(), className)} ref={ref}>
            {children}
        </p>
    );
});

Paragraph.displayName = 'Typography.Paragraph';

export default Paragraph;
