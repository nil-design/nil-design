import { cnJoin, cnMerge } from '@nild/shared';
import { ReactElement, forwardRef, isValidElement, cloneElement, Children } from 'react';
import { createPortal } from 'react-dom';
import Arrow from './Arrow';
import { PortalProps } from './interfaces';
import { portalClassNames, portalContentClassNames, portalArrowClassNames } from './style';

/**
 * @category Components
 */
const Portal = forwardRef<HTMLDivElement, PortalProps>(
    ({ className, children, container = document.body, paddingSize = 'medium', arrow = false, ...restProps }, ref) => {
        const child = Children.toArray(children).find(child => isValidElement(child));
        if (!child) return null;

        return createPortal(
            <div {...restProps} className={cnMerge(portalClassNames(), className)} ref={ref}>
                {cloneElement(child as ReactElement, {
                    ...child.props,
                    className: cnMerge(portalContentClassNames({ paddingSize }), child?.props?.className),
                })}
                {arrow !== false && <Arrow {...arrow} className={cnJoin(portalArrowClassNames(), arrow.className)} />}
            </div>,
            container,
        );
    },
);

Portal.displayName = 'Portal';

export default Portal;
