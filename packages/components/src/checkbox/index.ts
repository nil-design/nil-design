import CheckboxComponent from './Checkbox';
import Indicator from './Indicator';
import Label from './Label';

/**
 * @category Components
 */
const Checkbox = Object.assign(CheckboxComponent, {
    Indicator,
    Label,
});

export type * from './interfaces';
export default Checkbox;
