import AlertComponent from './Alert';
import Icon from './Icon';
import Title from './Title';

/**
 * @category Components
 */
const Alert = Object.assign(AlertComponent, {
    Icon,
    Title,
});

export type * from './interfaces';
export default Alert;
