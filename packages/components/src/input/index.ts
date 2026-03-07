import Append from './Append';
import Composite from './Composite';
import InputComponent from './Input';
import Number from './Number';
import OTP from './OTP';
import Password from './Password';
import Prefix from './Prefix';
import Prepend from './Prepend';
import Search from './Search';
import Suffix from './Suffix';

/**
 * @category Components
 */
const Input = Object.assign(InputComponent, {
    Composite,
    Prepend,
    Append,
    Prefix,
    Suffix,
    Search,
    Password,
    OTP,
    Number,
});

export type * from './interfaces';
export default Input;
