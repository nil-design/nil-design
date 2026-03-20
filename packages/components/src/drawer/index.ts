import Modal from '../modal';
import DrawerComponent from './Drawer';

/**
 * @category Components
 */
const Drawer = Object.assign(DrawerComponent, {
    Trigger: Modal.Trigger,
    Portal: Modal.Portal,
    Header: Modal.Header,
    Body: Modal.Body,
    Footer: Modal.Footer,
    Close: Modal.Close,
});

export type * from './interfaces';
export default Drawer;
