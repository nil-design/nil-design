import Popup from '../popup';
import PopoverComponent from './Popover';

/**
 * @category Components
 */
const Popover = Object.assign(PopoverComponent, {
    Trigger: Popup.Trigger,
    Portal: Popup.Portal,
});

export type * from './interfaces';
export default Popover;
