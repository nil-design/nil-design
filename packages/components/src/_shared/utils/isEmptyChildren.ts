import { isNil, isArray, isEmpty } from '@nild/shared/utils';
import { ReactNode, Fragment } from 'react';

const isEmptyChildren = (children: ReactNode): boolean => {
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

export default isEmptyChildren;
