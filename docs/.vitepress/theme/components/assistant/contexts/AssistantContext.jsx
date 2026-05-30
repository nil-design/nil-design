import React, { createContext, useContext } from 'react';

const EnvContext = createContext(null);
const SessionContext = createContext(null);
const ThreadContext = createContext(null);

const useRequiredContext = (context, name) => {
    const value = useContext(context);

    if (!value) {
        throw new Error(`${name} must be used within AssistantProvider.`);
    }

    return value;
};

export const AssistantProvider = ({ env, session, thread, children }) => {
    return (
        <EnvContext.Provider value={env}>
            <SessionContext.Provider value={session}>
                <ThreadContext.Provider value={thread}>{children}</ThreadContext.Provider>
            </SessionContext.Provider>
        </EnvContext.Provider>
    );
};

export const useEnvContext = () => useRequiredContext(EnvContext, 'useEnvContext');

export const useSessionContext = () => useRequiredContext(SessionContext, 'useSessionContext');

export const useThreadContext = () => useRequiredContext(ThreadContext, 'useThreadContext');
