import { useControllableState } from '@nild/hooks';
import { Icon } from '@nild/icons';
import CautionIcon from '@nild/icons/Caution';
import CloseIcon from '@nild/icons/Close';
import ErrorIcon from '@nild/icons/Error';
import InfoIcon from '@nild/icons/Info';
import SuccessIcon from '@nild/icons/Success';
import { cnMerge } from '@nild/shared';
import { MouseEvent, forwardRef } from 'react';
import Button from '../button';
import { AlertProps, AlertType } from './interfaces';
import variants from './style';

const defaultIconMap = {
    info: InfoIcon,
    success: SuccessIcon,
    warning: CautionIcon,
    error: ErrorIcon,
} satisfies Record<AlertType, typeof InfoIcon>;

/**
 * @category Components
 */
const Alert = forwardRef<HTMLDivElement, AlertProps>(
    (
        {
            className,
            children,
            title,
            icon,
            role = 'alert',
            type = 'info',
            closable = false,
            visible,
            defaultVisible = true,
            closeAriaLabel = 'Close',
            onClose,
            ...restProps
        },
        ref,
    ) => {
        const [currentVisible, setCurrentVisible] = useControllableState(visible, defaultVisible);

        if (!currentVisible) {
            return null;
        }

        const defaultIcon = <Icon component={defaultIconMap[type]} variant="filled" />;
        const iconNode = icon === undefined ? defaultIcon : icon;

        const handleClose = (evt: MouseEvent<HTMLButtonElement>) => {
            setCurrentVisible(false);
            onClose?.(evt);
        };

        return (
            <div {...restProps} className={cnMerge(variants.alert({ type }), className)} ref={ref} role={role}>
                {iconNode !== false && (
                    <span aria-hidden="true" className={variants.icon({ type })}>
                        {iconNode}
                    </span>
                )}
                <div className={variants.content()}>
                    {title && <div className={variants.title({ type })}>{title}</div>}
                    {children && <div className={variants.body()}>{children}</div>}
                </div>
                {closable && (
                    <Button
                        aria-label={closeAriaLabel}
                        className={variants.close()}
                        equal
                        onClick={handleClose}
                        shape="square"
                        size="small"
                        variant="text"
                    >
                        <Icon component={CloseIcon} />
                    </Button>
                )}
            </div>
        );
    },
);

Alert.displayName = 'Alert';

export default Alert;
