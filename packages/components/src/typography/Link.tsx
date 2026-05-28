import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { LinkProps } from './interfaces';
import variants from './style';

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, children, underlined = false, disabled = false, href = '#', ...restProps }, ref) => {
        const resolvedHref = disabled ? undefined : href;

        return (
            <a
                {...restProps}
                aria-disabled={disabled}
                href={resolvedHref}
                className={cnMerge(variants.link({ underlined }), className)}
                ref={ref}
            >
                {children}
            </a>
        );
    },
);

Link.displayName = 'Typography.Link';

export default Link;
