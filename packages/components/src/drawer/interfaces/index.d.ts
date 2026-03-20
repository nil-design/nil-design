import type { ModalProps, ModalPlacement } from '../../modal';

export interface DrawerProps extends Omit<ModalProps, 'placement'> {
    placement?: Exclude<ModalPlacement, 'center'>;
}
