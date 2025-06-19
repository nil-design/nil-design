import { cnMerge } from '@nild/shared';
import { AnchorHTMLAttributes, forwardRef } from 'react';
import { DISABLED_CLS } from '../_shared/style';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    disabled?: boolean;
    underlined?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, children, disabled, underlined, href = '#', ...restProps }, ref) => {
        const resolvedHref = disabled ? undefined : href;

        return (
            <a
                {...restProps}
                href={resolvedHref}
                className={cnMerge(
                    'nd-link',
                    [
                        'font-sans',
                        'text-link',
                        'text-[length:inherit]',
                        'cursor-pointer',
                        'enabled:hover:text-link-hover',
                        'enabled:active:text-link-active',
                    ],
                    DISABLED_CLS,
                    underlined ? 'underline' : 'no-underline',
                    disabled && 'disabled',
                    className,
                )}
                ref={ref}
            >
                {children}
            </a>
        );
    },
);

Link.displayName = 'Typography.Link';

export default Link;
