import React, { createContext, useContext, useMemo } from 'react';
import i18n from '../../../../../../locales/index';

const AssistantContext = createContext(null);

export const AssistantProvider = ({ locale, navigate, routePath, runtime, children }) => {
    const value = useMemo(
        () => ({
            ...runtime,
            i18n,
            locale,
            navigate,
            routePath,
        }),
        [locale, navigate, routePath, runtime],
    );

    return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
};

export const useAssistantContext = () => {
    const context = useContext(AssistantContext);

    if (!context) {
        throw new Error('useAssistantContext must be used within AssistantProvider.');
    }

    return context;
};
