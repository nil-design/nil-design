import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../_shared/utils';

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
    className?: string;
    children?: ReactNode;
}

const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(({ className, children, ...restProps }, ref) => {
    return (
        <p
            {...restProps}
            className={cn('nd-paragraph', 'text-primary', 'text-[length:inherit]', 'mt-0 mb-[1em]', className)}
            ref={ref}
        >
            {children}
        </p>
    );
});

Paragraph.displayName = 'Typography.Paragraph';

export default Paragraph;
