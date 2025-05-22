import clsx from 'clsx';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';

export interface AnchorProps extends HTMLAttributes<HTMLAnchorElement> {
    className?: string;
    children?: ReactNode;
}

const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(({ className, children, ...restProps }, ref) => {
    return (
        <a {...restProps} className={clsx('nd-anchor', className)} ref={ref}>
            {children}
        </a>
    );
});

Anchor.displayName = 'Typography.Anchor';

export default Anchor;
