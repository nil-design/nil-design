import PopupComponent from './Popup';
import Portal from './Portal';
import Trigger from './Trigger';

/**
 * @category Components
 */
const Popup = Object.assign(PopupComponent, {
    Trigger,
    Portal,
});

export type * from './interfaces';
export default Popup;
