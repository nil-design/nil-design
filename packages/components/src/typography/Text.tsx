import { cnJoin, cnMerge } from '@nild/shared/utils';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { DISABLED_CLS } from '../_shared/style';

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
        underlined && (finalChildren = <u className="underline">{finalChildren}</u>);
        italic && (finalChildren = <i>{finalChildren}</i>);
        marked && (finalChildren = <mark className="text-contrast bg-primary">{finalChildren}</mark>);
        coded &&
            (finalChildren = (
                <code
                    className={cnJoin(
                        'text-sm',
                        'ps-1.5 pe-1.5',
                        'bg-secondary rounded-sm border border-solid border-secondary',
                    )}
                >
                    {finalChildren}
                </code>
            ));
        keyboarded &&
            (finalChildren = (
                <kbd
                    className={cnJoin(
                        'text-sm',
                        'ps-1.5 pe-1.5',
                        'rounded-sm border border-b-2 border-solid border-secondary',
                    )}
                >
                    {finalChildren}
                </kbd>
            ));

        return (
            <span
                {...restProps}
                className={cnMerge(
                    ['nd-text', 'font-sans', 'text-[length:inherit]'],
                    DISABLED_CLS,
                    disabled && 'disabled',
                    !secondary ? 'text-primary' : 'text-secondary',
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
