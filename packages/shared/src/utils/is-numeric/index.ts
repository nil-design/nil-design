import { isNaN, isNumber, isString } from 'lodash-es';

const isNumeric = (value: string | number): boolean => {
    if (isNumber(value)) {
        return !isNaN(value) && isFinite(value);
    }

    if (!isString(value) || value.trim() === '') {
        return false;
    }

    const num = Number(value);

    return !isNaN(num) && isFinite(num) && value.trim() === String(num);
};

export default isNumeric;
