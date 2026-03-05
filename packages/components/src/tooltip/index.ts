import Popup from '../popup';
import TooltipComponent from './Tooltip';

/**
 * @category Components
 */
const Tooltip = Object.assign(TooltipComponent, {
    Trigger: Popup.Trigger,
    Portal: Popup.Portal,
});

export type * from './interfaces';
export default Tooltip;
