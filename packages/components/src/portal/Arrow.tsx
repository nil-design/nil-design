import { cnMerge } from '@nild/shared/utils';
import { CSSProperties, HTMLAttributes, forwardRef } from 'react';
import {
    ArrowSize,
    ArrowOrientation,
    ARROW_SIZE_CLS_MAP,
    ARROW_ORIENTATION_CLS_MAP,
    ARROW_ORIENTATION_STYLE_MAP,
} from './style';

interface ArrowProps extends HTMLAttributes<HTMLSpanElement> {
    className?: string;
    style?: CSSProperties;
    orientation?: ArrowOrientation;
    size?: ArrowSize;
}

const Arrow = forwardRef<HTMLDivElement, ArrowProps>(
    ({ className, style: externalStyle, orientation = 'up', size = 'medium', ...restProps }, ref) => {
        return (
            <div
                {...restProps}
                style={{ ...ARROW_ORIENTATION_STYLE_MAP[orientation], ...externalStyle }}
                className={cnMerge(
                    'nd-arrow',
                    'bg-container border-solid border-split',
                    ARROW_ORIENTATION_CLS_MAP[orientation],
                    ARROW_SIZE_CLS_MAP[size],
                    className,
                )}
                ref={ref}
            ></div>
        );
    },
);

Arrow.displayName = 'Arrow';

export default Arrow;
