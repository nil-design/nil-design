import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { ArrowProps } from './interfaces';
import { arrowClassNames } from './style';

const Arrow = forwardRef<HTMLDivElement, ArrowProps>(
    ({ className, orientation = 'up', size = 'medium', ...restProps }, ref) => {
        return (
            <div {...restProps} className={cnMerge(arrowClassNames({ orientation, size }), className)} ref={ref}></div>
        );
    },
);

Arrow.displayName = 'Arrow';

export default Arrow;
