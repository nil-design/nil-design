import { forwardRef, ForwardRefExoticComponent, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../_shared/utils';
import Link from './Link';
import Paragraph from './Paragraph';
import Text from './Text';
import Title from './Title';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
    className?: string;
    children?: ReactNode;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(({ className, children, ...restProps }, ref) => {
    return (
        <article {...restProps} className={cn('nd-typography', 'font-sans', 'text-md', className)} ref={ref}>
            {children}
        </article>
    );
}) as ForwardRefExoticComponent<TypographyProps> & {
    Link: typeof Link;
    Paragraph: typeof Paragraph;
    Text: typeof Text;
    Title: typeof Title;
};

Typography.Link = Link;
Typography.Paragraph = Paragraph;
Typography.Text = Text;
Typography.Title = Title;
Typography.displayName = 'Typography';

export default Typography;
