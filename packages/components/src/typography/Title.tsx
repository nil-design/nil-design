import { cnMerge } from '@nild/shared';
import { HTMLAttributes, forwardRef } from 'react';
import { HeadingLevel, HEADING_LEVEL_CLS_MAP } from './style';

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    level?: HeadingLevel;
}

const Title = forwardRef<HTMLHeadingElement, TitleProps>(({ className, children, level = 1, ...restProps }, ref) => {
    const Heading = `h${level}` as const;

    return (
        <Heading
            {...restProps}
            className={cnMerge(
                ['nd-title', 'font-sans font-semibold text-primary', 'mt-[1em] mb-[0.5em]'],
                HEADING_LEVEL_CLS_MAP[level],
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
