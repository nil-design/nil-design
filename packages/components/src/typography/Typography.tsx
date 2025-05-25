import clsx from 'clsx';
import { forwardRef, ForwardRefExoticComponent, HTMLAttributes, ReactNode } from 'react';
import Anchor from './Anchor';
import Paragraph from './Paragraph';
import Text from './Text';
import Title from './Title';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    className?: string;
    children?: ReactNode;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(({ className, children, ...restProps }, ref) => {
    return (
        <article {...restProps} className={clsx('nd-typography', 'nd-font-sans', 'nd-text-md', className)} ref={ref}>
            {children}
        </article>
    );
}) as ForwardRefExoticComponent<TypographyProps> & {
    Anchor: typeof Anchor;
    Paragraph: typeof Paragraph;
    Text: typeof Text;
    Title: typeof Title;
};

Typography.Anchor = Anchor;
Typography.Paragraph = Paragraph;
Typography.Text = Text;
Typography.Title = Title;
Typography.displayName = 'Typography';

export default Typography;
