import { cnMerge, getDPR, mergeRefs } from '@nild/shared';
import { ReactElement, forwardRef, isValidElement, cloneElement, Children } from 'react';
import { createPortal } from 'react-dom';
import Arrow from './Arrow';
import { usePopupContext, usePortalContext } from './contexts';
import { PortalProps } from './interfaces';
import { portalClassNames, portalContentClassNames } from './style';

const Portal = forwardRef<HTMLDivElement, PortalProps>(
    ({ className, style, children, container = document.body, ...restProps }, ref) => {
        const { size, refs, enter, leave } = usePopupContext();
        const { coords } = usePortalContext();
        const child = Children.toArray(children).find(child => isValidElement(child));

        if (!child) return null;

        return createPortal(
            <div
                {...restProps}
                className={cnMerge(portalClassNames(), className)}
                style={{
                    transform: `translate(${coords.x}px, ${coords.y}px)`,
                    ...(getDPR() >= 1.5 && { willChange: 'transform' }),
                    ...style,
                }}
                onMouseEnter={enter}
                onMouseLeave={leave}
                ref={mergeRefs(refs.portal, ref)}
            >
                {cloneElement(child as ReactElement, {
                    ...child.props,
                    className: cnMerge(portalContentClassNames({ size }), child?.props?.className),
                })}
                <Arrow />
            </div>,
            container,
        );
    },
);

Portal.displayName = 'Popup.Portal';

export default Portal;
