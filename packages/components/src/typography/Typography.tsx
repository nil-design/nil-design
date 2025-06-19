import { cnMerge } from '@nild/shared';
import { HTMLAttributes, ForwardRefExoticComponent, forwardRef } from 'react';
import Link from './Link';
import Paragraph from './Paragraph';
import Text from './Text';
import Title from './Title';

export type TypographyProps = HTMLAttributes<HTMLElement>;

const Typography = forwardRef<HTMLElement, TypographyProps>(({ className, children, ...restProps }, ref) => {
    return (
        <article {...restProps} className={cnMerge('nd-typography', 'font-sans text-md', className)} ref={ref}>
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
