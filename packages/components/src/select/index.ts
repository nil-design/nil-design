import Option from './Option';
import SelectComponent from './Select';

/**
 * @category Components
 */
const Select = Object.assign(SelectComponent, {
    Option,
});

export type * from './interfaces';
export default Select;
