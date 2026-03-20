import Modal from '../modal';
import DialogComponent from './Dialog';

/**
 * @category Components
 */
const Dialog = Object.assign(DialogComponent, {
    Trigger: Modal.Trigger,
    Portal: Modal.Portal,
    Header: Modal.Header,
    Body: Modal.Body,
    Footer: Modal.Footer,
    Close: Modal.Close,
});

export type * from './interfaces';
export default Dialog;
