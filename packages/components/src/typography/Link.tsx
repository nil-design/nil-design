import { forwardRef, AnchorHTMLAttributes, ReactNode } from 'react';
import { disabledClassNames } from '../_core/style';
import { cn, isEmptyChildren } from '../_core/utils';

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
                className={cn(
                    [
                        'nd-link',
                        'font-sans',
                        'text-link',
                        'text-[length:inherit]',
                        'cursor-pointer',
                        'enabled:hover:text-link-hover',
                        'enabled:active:text-link-active',
                    ],
                    underlined ? 'underline' : 'no-underline',
                    disabled && 'disabled',
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
