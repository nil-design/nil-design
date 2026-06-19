import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { PanelProps } from './interfaces';
import variants from './style';

const Panel = forwardRef<HTMLDivElement, PanelProps>(
    (
        { className, children, defaultSize: _defaultSize, min: _min, max: _max, resizable: _resizable, ...restProps },
        ref,
    ) => {
        return (
            <div {...restProps} className={cnMerge(variants.panel(), className)} ref={ref}>
                {children}
            </div>
        );
    },
);

Panel.displayName = 'Splitter.Panel';

export const isPanelElement = (child: ReactNode): child is ReactElement<PanelProps> => {
    return isValidElement(child) && child.type === Panel;
};

export default Panel;
