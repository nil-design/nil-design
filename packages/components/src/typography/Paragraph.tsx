import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { ParagraphProps } from './interfaces';
import { paragraphClassNames } from './style';

const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(({ className, children, ...restProps }, ref) => {
    return (
        <p {...restProps} className={cnMerge(paragraphClassNames(), className)} ref={ref}>
            {children}
        </p>
    );
});

Paragraph.displayName = 'Typography.Paragraph';

export default Paragraph;
