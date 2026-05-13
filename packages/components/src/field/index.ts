import FieldComponent from './Field';
import Helper from './Helper';
import Label from './Label';
import RequiredIndicator from './RequiredIndicator';
import Status from './Status';

/**
 * @category Components
 */
const Field = Object.assign(FieldComponent, {
    Label,
    Helper,
    Status,
    RequiredIndicator,
});

export type * from './interfaces';
export default Field;
