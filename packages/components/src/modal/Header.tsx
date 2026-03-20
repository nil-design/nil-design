import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { HeaderProps } from './interfaces';
import variants from './style';

export const isHeaderElement = (child: ReactNode): child is ReactElement<HeaderProps> => {
    return isValidElement(child) && child.type === Header;
};

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className, children, ...restProps }, ref) => {
    return (
        <div {...restProps} className={cnMerge(variants.header(), className)} ref={ref}>
            {children}
        </div>
    );
});

Header.displayName = 'Modal.Header';

export default Header;
