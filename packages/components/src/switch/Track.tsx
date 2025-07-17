import { cnMerge } from '@nild/shared';
import { forwardRef } from 'react';
import { useSwitchContext } from './contexts';
import { TrackProps } from './interfaces';
import { trackClassNames } from './style';

const Track = forwardRef<HTMLDivElement, TrackProps>(({ className, children, type, ...restProps }, ref) => {
    const { variant, checked } = useSwitchContext();

    return (
        <div {...restProps} className={cnMerge(trackClassNames({ type, variant, checked }), className)} ref={ref}>
            {children}
        </div>
    );
});

Track.displayName = 'Switch.Track';

export default Track;
