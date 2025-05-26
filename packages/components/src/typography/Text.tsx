import clsx from 'clsx';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { disabledClassNames } from '../_core/style';

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
    className?: string;
    children?: ReactNode;
    disabled?: boolean;
    secondary?: boolean;
    strong?: boolean;
    deleted?: boolean;
    underlined?: boolean;
    italic?: boolean;
    marked?: boolean;
    coded?: boolean;
    keyboarded?: boolean;
}

const Text = forwardRef<HTMLSpanElement, TextProps>(
    (
        {
            className,
            children,
            disabled,
            secondary,
            strong,
            deleted,
            underlined,
            italic,
            marked,
            coded,
            keyboarded,
            ...restProps
        },
        ref,
    ) => {
        let finalChildren = children;

        strong && (finalChildren = <strong>{finalChildren}</strong>);
        deleted && (finalChildren = <del>{finalChildren}</del>);
        underlined && (finalChildren = <u className="nd-underline">{finalChildren}</u>);
        italic && (finalChildren = <i>{finalChildren}</i>);
        marked && (finalChildren = <mark className="nd-text-primary nd-bg-primary-mark">{finalChildren}</mark>);
        coded &&
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
        keyboarded &&
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
