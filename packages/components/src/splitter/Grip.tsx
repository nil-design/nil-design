import { cnMerge } from '@nild/shared';
import { Children, ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { useSplitterGripContext } from './contexts';
import { GripProps } from './interfaces';
import variants from './style';

const Grip = forwardRef<HTMLSpanElement, GripProps>(
    ({ className, children, 'aria-hidden': ariaHidden = true, ...restProps }, ref) => {
        const { active, orientation } = useSplitterGripContext();
        const custom = Children.toArray(children).length > 0;

        return (
            <span
                {...restProps}
                aria-hidden={ariaHidden}
                className={cnMerge(variants.grip({ orientation, active, custom }), className)}
                ref={ref}
            >
                {children}
            </span>
        );
    },
);

Grip.displayName = 'Splitter.Grip';

export const isGripElement = (child: ReactNode): child is ReactElement<GripProps> => {
    return isValidElement(child) && child.type === Grip;
};

export default Grip;
