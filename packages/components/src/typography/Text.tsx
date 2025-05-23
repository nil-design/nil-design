import clsx from 'clsx';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { disabledClassNames } from '../_core/style';

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
    className?: string;
    children?: ReactNode;
    disabled?: boolean;
    secondary?: boolean;
    strong?: boolean;
    /** strikethrough */
    del?: boolean;
    /** underline */
    u?: boolean;
    /** italic */
    i?: boolean;
    mark?: boolean;
    code?: boolean;
    /** keyboard */
    kbd?: boolean;
}

const Text = forwardRef<HTMLSpanElement, TextProps>(
    ({ className, children, disabled, secondary, strong, del, u, i, mark, code, kbd, ...restProps }, ref) => {
        let finalChildren = children;

        strong && (finalChildren = <strong>{finalChildren}</strong>);
        del && (finalChildren = <del>{finalChildren}</del>);
        u && (finalChildren = <u>{finalChildren}</u>);
        i && (finalChildren = <i>{finalChildren}</i>);
        mark && (finalChildren = <mark className="nd-text-primary nd-bg-primary-mark">{finalChildren}</mark>);
        code &&
            (finalChildren = (
                <code
                    className={clsx(
                        'nd-text-sm',
                        'nd-ps-1.5 nd-pe-1.5',
                        'nd-rounded-sm nd-border nd-border-solid nd-border-secondary',
                    )}
                >
                    {finalChildren}
                </code>
            ));
        kbd &&
            (finalChildren = (
                <kbd
                    className={clsx(
                        'nd-text-sm',
                        'nd-ps-1.5 nd-pe-1.5',
                        'nd-rounded-sm nd-border nd-border-b-2 nd-border-solid nd-border-secondary',
                    )}
                >
                    {finalChildren}
                </kbd>
            ));

        return (
            <span
                {...restProps}
                className={clsx(
                    ['nd-text', 'nd-font-sans', 'nd-text-[length:inherit]'],
                    disabled && 'nd-disabled',
                    !secondary ? 'nd-text-primary' : 'nd-text-secondary',
                    disabledClassNames,
                    className,
                )}
                ref={ref}
            >
                {finalChildren}
            </span>
        );
    },
);

Text.displayName = 'Typography.Text';

export default Text;
