import { cnMerge } from '@nild/shared';
import { HTMLAttributes, forwardRef } from 'react';

export type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;

const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(({ className, children, ...restProps }, ref) => {
    return (
        <p
            {...restProps}
            className={cnMerge('nd-paragraph', 'text-primary text-[length:inherit]', 'mt-0 mb-[1em]', className)}
            ref={ref}
        >
            {children}
        </p>
    );
});

Paragraph.displayName = 'Typography.Paragraph';

export default Paragraph;
