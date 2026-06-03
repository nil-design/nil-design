import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { useAlertContext } from './contexts';
import { TitleProps } from './interfaces';
import variants from './style';

export const isTitleElement = (child: ReactNode): child is ReactElement<TitleProps> => {
    return isValidElement(child) && child.type === Title;
};

const Title = forwardRef<HTMLDivElement, TitleProps>(({ className, children, ...restProps }, ref) => {
    const { type } = useAlertContext();

    return (
        <div {...restProps} className={cnMerge(variants.title({ type }), className)} ref={ref}>
            {children}
        </div>
    );
});

Title.displayName = 'Alert.Title';

export default Title;
