import React from 'react';

interface Options<T> {
    displayName?: string;
    defaultValue: T;
}

const createContext = <T>({ displayName, defaultValue }: Options<T>) => {
    const Context = React.createContext<T>(defaultValue);
    const useContext = () => React.useContext(Context);

    Context.displayName = displayName;

    return [Context.Provider, useContext] as const;
};

export default createContext;
