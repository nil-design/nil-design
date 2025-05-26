import clsx from 'clsx';
import { forwardRef, AnchorHTMLAttributes, ReactNode } from 'react';
import { disabledClassNames } from '../_core/style';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    className?: string;
    children?: ReactNode;
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
                className={clsx(
                    [
                        'nd-link',
                        'nd-font-sans',
                        'nd-text-link nd-text-[length:inherit]',
                        'nd-cursor-pointer',
                        'hover:nd-text-link-hover',
                        'active:nd-text-link-active',
                    ],
                    underlined ? 'nd-underline' : 'nd-no-underline',
                    disabled && 'nd-disabled',
                    disabledClassNames,
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
