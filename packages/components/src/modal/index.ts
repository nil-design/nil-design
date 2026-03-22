import Body from './Body';
import Close from './Close';
import Footer from './Footer';
import Header from './Header';
import ModalComponent from './Modal';
import Portal from './Portal';
import Trigger from './Trigger';

/**
 * @category Components
 */
const Modal = Object.assign(ModalComponent, {
    Trigger,
    Portal,
    Header,
    Body,
    Footer,
    Close,
});

export type * from './interfaces';
export default Modal;
