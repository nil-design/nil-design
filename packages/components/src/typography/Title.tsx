import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { TitleProps } from './interfaces';
import variants from './style';

const Title = forwardRef<HTMLHeadingElement, TitleProps>(({ className, children, level = 1, ...restProps }, ref) => {
    const Heading = `h${level}` as const;

    return (
        <Heading {...restProps} className={cnMerge(variants.title({ level }), className)} ref={ref}>
            {children}
        </Heading>
    );
});

Title.displayName = 'Typography.Title';

export default Title;
