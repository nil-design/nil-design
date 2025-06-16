import { cnMerge } from '@nild/shared/utils';
import {
    HTMLAttributes,
    ReactNode,
    ReactElement,
    Ref,
    forwardRef,
    isValidElement,
    cloneElement,
    Children,
} from 'react';
import { createPortal } from 'react-dom';
import Arrow, { ArrowProps } from './Arrow';
import { PaddingSize, PADDING_SIZE_CLS_MAP } from './style';

interface ArrowOptions extends ArrowProps {
    ref: Ref<HTMLDivElement>;
}

export interface PortalProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    container?: Element | DocumentFragment;
    paddingSize?: PaddingSize;
    arrow?: ArrowOptions | false;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(
    ({ className, children, container = document.body, paddingSize = 'medium', arrow = false, ...restProps }, ref) => {
        const child = Children.only(children);
        if (!child || !isValidElement(child)) return null;

        const onlyChild = child as ReactElement;

        return createPortal(
            <div {...restProps} className={cnMerge('nd-portal', 'absolute top-0 left-0', className)} ref={ref}>
                {cloneElement(onlyChild, {
                    ...onlyChild.props,
                    className: cnMerge(
                        'bg-container rounded-md outline-solid outline-1 outline-split shadow-lg',
                        PADDING_SIZE_CLS_MAP[paddingSize],
                        onlyChild?.props?.className,
                    ),
                })}
                {arrow !== false && <Arrow {...arrow} className={cnMerge('absolute', arrow.className)} />}
            </div>,
            container,
        );
    },
);

Portal.displayName = 'Portal';

export default Portal;
