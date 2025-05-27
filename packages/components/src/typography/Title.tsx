import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../_core/utils';
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
            className={cn(
                ['nd-title', 'font-sans', 'font-semibold', 'text-primary', 'mt-[1em] mb-[0.5em]'],
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
