import { useEffectCallback } from '@nild/hooks';
import { cnMerge, getDPR, mergeRefs } from '@nild/shared';
import { ReactElement, MouseEvent, forwardRef, isValidElement, cloneElement, Children } from 'react';
import { createPortal } from 'react-dom';
import { usePortalContainerContext } from '../_shared/contexts';
import { getOwnerDocument } from '../_shared/utils';
import Arrow from './Arrow';
import { usePopupContext, usePortalContext } from './contexts';
import { PortalProps } from './interfaces';
import variants from './style';

const Portal = forwardRef<HTMLDivElement, PortalProps>(
    ({ className, style, children, container: externalContainer, ...restProps }, ref) => {
        const { size, inverse, refs, enter, leave } = usePopupContext();
        const { coords } = usePortalContext();
        const portalContainerContext = usePortalContainerContext();
        const child = Children.toArray(children).find(child => isValidElement(child));
        const ownerDocument = getOwnerDocument(externalContainer, refs.trigger.current);
        const container = externalContainer ?? portalContainerContext.container ?? ownerDocument?.body ?? null;

        const handleMouseEnter = useEffectCallback((evt: MouseEvent<HTMLDivElement>) => {
            restProps?.onMouseEnter?.(evt);
            enter();
        });

        const handleMouseLeave = useEffectCallback((evt: MouseEvent<HTMLDivElement>) => {
            restProps?.onMouseLeave?.(evt);
            leave();
        });

        if (!child || !container) return null;

        return createPortal(
            <div
                {...restProps}
                className={cnMerge(variants.portal(), className)}
                style={{
                    transform: `translate(${coords.x}px, ${coords.y}px)`,
                    ...(getDPR() >= 1.5 && { willChange: 'transform' }),
                    ...style,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={mergeRefs(refs.portal, ref)}
            >
                {cloneElement(child as ReactElement, {
                    ...child.props,
                    className: cnMerge(variants.portalContent({ size, inverse }), child?.props?.className),
                })}
                <Arrow />
            </div>,
            container,
        );
    },
);

Portal.displayName = 'Popup.Portal';

export default Portal;
