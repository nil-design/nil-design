import { isNil, isNumber, isString, isArray } from '@nild/shared/utils';
import { ReactNode } from 'react';

const isPlainChildren = (children: ReactNode): children is string | number => {
    if (isNil(children)) return false;
    if (isString(children) || isNumber(children)) return true;
    if (isArray(children)) {
        return children.every(child => isPlainChildren(child));
    }

    return false;
};

export default isPlainChildren;
