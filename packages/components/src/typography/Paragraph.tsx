import clsx from 'clsx';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
    className?: string;
    children?: ReactNode;
}

const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(({ className, children, ...restProps }, ref) => {
    return (
        <p
            {...restProps}
            className={clsx(
                'nd-paragraph',
                'nd-text-primary nd-text-[length:inherit]',
                'nd-mt-0 nd-mb-[1em]',
                className,
            )}
            ref={ref}
        >
            {children}
        </p>
    );
});

Paragraph.displayName = 'Typography.Paragraph';

export default Paragraph;
