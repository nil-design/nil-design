import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { LinkProps } from './interfaces';
import { linkClassNames } from './style';

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, children, underlined = false, disabled = false, href = '#', ...restProps }, ref) => {
        const resolvedHref = disabled ? undefined : href;

        return (
            <a
                {...restProps}
                href={resolvedHref}
                className={cnMerge(linkClassNames({ underlined, disabled }), className)}
                ref={ref}
            >
                {children}
            </a>
        );
    },
);

Link.displayName = 'Typography.Link';

export default Link;
