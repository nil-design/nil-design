import CheckboxComponent from './Checkbox';
import Group from './Group';
import Indicator from './Indicator';
import Label from './Label';

/**
 * @category Components
 */
const Checkbox = Object.assign(CheckboxComponent, {
    Indicator,
    Label,
    Group,
});

export type * from './interfaces';
export default Checkbox;
