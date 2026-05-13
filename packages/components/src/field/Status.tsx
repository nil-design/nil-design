import { cnMerge } from '@nild/shared';
import { forwardRef, isValidElement, ReactElement, ReactNode } from 'react';
import { useFieldContext } from './contexts';
import variants from './style';
import type { StatusProps } from './interfaces';

const hasContent = (value: StatusProps['children']) => value !== undefined && value !== null && value !== false;

const Status = forwardRef<HTMLDivElement, StatusProps>(({ className, children, type, ...restProps }, ref) => {
    const { issue, status } = useFieldContext();
    const currentStatus = type ?? status;
    const content = hasContent(children) ? children : issue;

    if (!hasContent(content)) {
        return null;
    }

    return (
        <div
            {...restProps}
            className={cnMerge(variants.status({ status: currentStatus }), className)}
            data-status={currentStatus}
            ref={ref}
        >
            {content}
        </div>
    );
});

Status.displayName = 'Field.Status';

export const isStatusElement = (child: ReactNode): child is ReactElement<StatusProps> => {
    return isValidElement(child) && child.type === Status;
};

export default Status;
