import { cnMerge } from '@nild/shared';
import { forwardRef, isValidElement, ReactElement, ReactNode } from 'react';
import variants from './style';
import type { ActionsProps } from './interfaces';

const Actions = forwardRef<HTMLDivElement, ActionsProps>(({ className, children, ...restProps }, ref) => {
    return (
        <div {...restProps} className={cnMerge(variants.actions(), className)} ref={ref}>
            {children}
        </div>
    );
});

Actions.displayName = 'Form.Actions';

export const isActionsElement = (child: ReactNode): child is ReactElement<ActionsProps> => {
    return isValidElement(child) && child.type === Actions;
};

export default Actions;
