import { Icon } from '@nild/icons';
import CloseIcon from '@nild/icons/Close';
import { cnMerge } from '@nild/shared';
import { ReactElement, ReactNode, forwardRef, isValidElement } from 'react';
import { mergeHandlers } from '../_shared/utils';
import Button from '../button';
import { useModalContext } from './contexts';
import { CloseProps } from './interfaces';
import variants from './style';

export const isCloseElement = (child: ReactNode): child is ReactElement<CloseProps> => {
    return isValidElement(child) && child.type === Close;
};

const Close = forwardRef<HTMLButtonElement, CloseProps>(
    (
        {
            children,
            variant = 'text',
            shape = 'round',
            size = 'small',
            equal = true,
            'aria-label': ariaLabel = 'Close',
            onClick,
            className,
            disabled: externalDisabled,
            ...restProps
        },
        ref,
    ) => {
        const { disabled, close } = useModalContext();

        return (
            <Button
                {...restProps}
                aria-label={ariaLabel}
                className={cnMerge(variants.close(), className)}
                disabled={disabled || externalDisabled}
                equal={equal}
                onClick={mergeHandlers(onClick, evt => {
                    close();

                    return evt;
                })}
                ref={ref}
                shape={shape}
                size={size}
                variant={variant}
            >
                {children ?? <Icon component={CloseIcon} />}
            </Button>
        );
    },
);

Close.displayName = 'Modal.Close';

export default Close;
