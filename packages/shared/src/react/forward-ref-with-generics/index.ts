import React, { ForwardedRef, ReactElement, PropsWithoutRef, RefAttributes } from 'react';

const forwardRefWithGenerics = <T, P = object>(render: (props: P, ref: ForwardedRef<T>) => ReactElement | null) => {
    return React.forwardRef(render) as unknown as (props: PropsWithoutRef<P> & RefAttributes<T>) => ReactElement | null;
};

export default forwardRefWithGenerics;
