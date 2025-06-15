import { cnMerge } from '@nild/shared/utils';
import {
    HTMLAttributes,
    ReactNode,
    ReactElement,
    Ref,
    CSSProperties,
    forwardRef,
    isValidElement,
    cloneElement,
    Children,
} from 'react';
import { createPortal } from 'react-dom';
import Arrow from './Arrow';
import { ArrowOrientation, PaddingSize, PADDING_SIZE_CLS_MAP } from './style';

export interface PortalProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    paddingSize?: PaddingSize;
    arrowRef?: Ref<HTMLDivElement>;
    arrowStyle?: CSSProperties;
    arrowOrientation?: ArrowOrientation;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(
    ({ children, paddingSize = 'medium', arrowRef, arrowStyle, arrowOrientation, ...restProps }, ref) => {
        const child = Children.only(children);
        if (!child || !isValidElement(child)) return null;

        const onlyChild = child as ReactElement;

        return createPortal(
            <div {...restProps} className="nd-portal absolute top-0 left-0" ref={ref}>
                {cloneElement(onlyChild, {
                    ...onlyChild.props,
                    className: cnMerge(
                        'bg-container rounded-md outline-solid outline-1 outline-split shadow-lg',
                        PADDING_SIZE_CLS_MAP[paddingSize],
                        onlyChild?.props?.className,
                    ),
                })}
                <Arrow className="absolute" ref={arrowRef} style={arrowStyle} orientation={arrowOrientation} />
            </div>,
            document.body,
        );
    },
);

Portal.displayName = 'Portal';

export default Portal;
