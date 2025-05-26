import { isArray, isEmpty, isNil, isNumber, isString } from 'lodash-es';
import { ReactNode, Fragment } from 'react';

export const kebabToPascal = (text: string) => {
    if (text.includes('-')) {
        return text
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const isPlainChildren = (children: ReactNode): children is string | number => {
    if (isNil(children)) return false;
    if (isString(children) || isNumber(children)) return true;
    if (isArray(children)) {
        return children.every(child => isPlainChildren(child));
    }
    return false;
};

export const isEmptyChildren = (children: ReactNode): boolean => {
    if (isNil(children)) return true;
    if (isArray(children) && isEmpty(children)) return true;
    if (
        typeof children === 'object' &&
        'type' in children &&
        children.type === Fragment &&
        isEmptyChildren(children.props.children)
    )
        return true;
    return false;
};
