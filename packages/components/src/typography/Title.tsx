import clsx from 'clsx';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { HeadingLevel, headingClassNames } from './style';

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    children?: ReactNode;
    level?: HeadingLevel;
}

const Title = forwardRef<HTMLHeadingElement, TitleProps>(({ className, children, level = 1, ...restProps }, ref) => {
    const Heading = `h${level}` as const;

    return (
        <Heading
            {...restProps}
            className={clsx(
                ['nd-title', 'nd-font-sans', 'nd-font-semibold', 'nd-text-primary', 'nd-mt-[1em] nd-mb-[0.5em]'],
                headingClassNames[level],
                className,
            )}
            ref={ref}
        >
            {children}
        </Heading>
    );
});

Title.displayName = 'Typography.Title';

export default Title;
