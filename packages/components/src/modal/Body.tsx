import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { BodyProps } from './interfaces';
import variants from './style';

export const isBodyElement = (child: ReactNode): child is ReactElement<BodyProps> => {
    return isValidElement(child) && child.type === Body;
};

const Body = forwardRef<HTMLDivElement, BodyProps>(({ className, children, ...restProps }, ref) => {
    return (
        <div {...restProps} className={cnMerge(variants.body(), className)} ref={ref}>
            {children}
        </div>
    );
});

Body.displayName = 'Modal.Body';

export default Body;
