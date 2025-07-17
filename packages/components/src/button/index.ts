import ButtonComponent from './Button';
import Group from './Group';

/**
 * @category Components
 */
const Button = Object.assign(ButtonComponent, {
    Group,
});

export type * from './interfaces';
export default Button;
