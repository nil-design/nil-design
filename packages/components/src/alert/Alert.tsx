import { useControllableState } from '@nild/hooks';
import { Icon } from '@nild/icons';
import CautionIcon from '@nild/icons/Caution';
import CloseIcon from '@nild/icons/Close';
import ErrorIcon from '@nild/icons/Error';
import InfoIcon from '@nild/icons/Info';
import SuccessIcon from '@nild/icons/Success';
import { cnMerge } from '@nild/shared';
import { MouseEvent, forwardRef } from 'react';
import { registerSlots } from '../_shared/utils';
import Button from '../button';
import { AlertProvider } from './contexts';
import AlertIcon, { isIconElement } from './Icon';
import { AlertProps } from './interfaces';
import variants from './style';
import { isTitleElement } from './Title';

const collectSlots = registerSlots({
    icon: { isMatched: isIconElement },
    title: { isMatched: isTitleElement },
});

/**
 * @category Components
 */
const Alert = forwardRef<HTMLDivElement, AlertProps>(
    (
        {
            className,
            children,
            role = 'alert',
            type = 'info',
            closable = false,
            visible: externalVisible,
            defaultVisible = true,
            closeAriaLabel = 'Close',
            onClose,
            ...restProps
        },
        ref,
    ) => {
        const [visible, setVisible] = useControllableState(externalVisible, defaultVisible);

        if (!visible) {
            return null;
        }

        const { slots, restChildren } = collectSlots(children);
        const iconNode = slots.icon.el ?? (
            <AlertIcon>
                <Icon
                    component={
                        {
                            info: InfoIcon,
                            success: SuccessIcon,
                            warning: CautionIcon,
                            error: ErrorIcon,
                        }[type]
                    }
                    variant="filled"
                />
            </AlertIcon>
        );

        const handleClose = (evt: MouseEvent<HTMLButtonElement>) => {
            setVisible(false);
            onClose?.(evt);
        };

        return (
            <AlertProvider value={{ type }}>
                <div {...restProps} className={cnMerge(variants.alert({ type }), className)} ref={ref} role={role}>
                    {iconNode}
                    <div className={variants.content()}>
                        {slots.title.el}
                        {restChildren.length > 0 && <div className={variants.body()}>{restChildren}</div>}
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
            </AlertProvider>
        );
    },
);

Alert.displayName = 'Alert';

export default Alert;
