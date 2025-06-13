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
} from 'react';
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
        const child = Array.isArray(children) ? children[0] : children;
        if (!child || !isValidElement(child)) return null;

        const firstChild = child as ReactElement;

        return (
            <div {...restProps} className="nd-portal absolute top-0 left-0" ref={ref}>
                {cloneElement(firstChild, {
                    ...firstChild.props,
                    className: cnMerge(
                        'bg-container rounded-md outline-solid outline-1 outline-split shadow-lg',
                        PADDING_SIZE_CLS_MAP[paddingSize],
                        firstChild?.props?.className,
                    ),
                })}
                <Arrow className="absolute" ref={arrowRef} style={arrowStyle} orientation={arrowOrientation} />
            </div>
        );
    },
);

Portal.displayName = 'Portal';

export default Portal;
