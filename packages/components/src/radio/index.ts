import Group from './Group';
import Indicator from './Indicator';
import Label from './Label';
import RadioComponent from './Radio';

/**
 * @category Components
 */
const Radio = Object.assign(RadioComponent, {
    Indicator,
    Label,
    Group,
});

export type * from './interfaces';
export default Radio;
