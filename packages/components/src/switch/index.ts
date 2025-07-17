import SwitchComponent from './Switch';
import Thumb from './Thumb';
import Track from './Track';

/**
 * @category Components
 */
const Switch = Object.assign(SwitchComponent, {
    Track,
    Thumb,
});

export type * from './interfaces';
export default Switch;
