import { ModalPlacement, ModalVariant } from '../interfaces';

export const resolvePlacement = (variant: ModalVariant, placement?: ModalPlacement): ModalPlacement => {
    if (variant === 'drawer') {
        return placement && placement !== 'center' ? placement : 'right';
    }

    return 'center';
};
