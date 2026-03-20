import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { FooterProps } from './interfaces';
import variants from './style';

export const isFooterElement = (child: ReactNode): child is ReactElement<FooterProps> => {
    return isValidElement(child) && child.type === Footer;
};

const Footer = forwardRef<HTMLDivElement, FooterProps>(({ className, children, ...restProps }, ref) => {
    return (
        <div {...restProps} className={cnMerge(variants.footer(), className)} ref={ref}>
            {children}
        </div>
    );
});

Footer.displayName = 'Modal.Footer';

export default Footer;
