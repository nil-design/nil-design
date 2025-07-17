import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { useSwitchContext } from './contexts';
import { ThumbProps } from './interfaces';
import { thumbClassNames } from './style';

const Thumb = forwardRef<HTMLDivElement, ThumbProps>(({ className, children, ...restProps }, ref) => {
    const { variant, shape, checked } = useSwitchContext();

    return (
        <div {...restProps} className={cnMerge(thumbClassNames({ variant, shape, checked }), className)} ref={ref}>
            {children?.(!!checked)}
        </div>
    );
});

Thumb.displayName = 'Switch.Thumb';

export default Thumb;
