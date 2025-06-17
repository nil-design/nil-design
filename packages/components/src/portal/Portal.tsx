import { cnJoin, cnMerge } from '@nild/shared/utils';
import { HTMLAttributes, ReactElement, Ref, forwardRef, isValidElement, cloneElement, Children } from 'react';
import { createPortal } from 'react-dom';
import Arrow, { ArrowProps } from './Arrow';
import { PaddingSize, PADDING_SIZE_CLS_MAP } from './style';

interface ArrowOptions extends ArrowProps {
    ref: Ref<HTMLDivElement>;
}

export interface PortalProps extends HTMLAttributes<HTMLDivElement> {
    container?: Element | DocumentFragment;
    paddingSize?: PaddingSize;
    arrow?: ArrowOptions | false;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(
    ({ className, children, container = document.body, paddingSize = 'medium', arrow = false, ...restProps }, ref) => {
        const child = Children.toArray(children).find(child => isValidElement(child));
        if (!child) return null;

        return createPortal(
            <div {...restProps} className={cnMerge('nd-portal', 'absolute top-0 left-0', className)} ref={ref}>
                {cloneElement(child as ReactElement, {
                    ...child.props,
                    className: cnMerge(
                        'bg-container rounded-md outline-solid outline-1 outline-split shadow-lg',
                        PADDING_SIZE_CLS_MAP[paddingSize],
                        child?.props?.className,
                    ),
                })}
                {arrow !== false && <Arrow {...arrow} className={cnJoin('absolute', arrow.className)} />}
            </div>,
            container,
        );
    },
);

Portal.displayName = 'Portal';

export default Portal;
