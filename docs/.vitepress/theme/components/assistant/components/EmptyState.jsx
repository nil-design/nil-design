import { DynamicIcon } from '@nild/icons';
import { memo, useEffect, useState } from 'react';
import { useEnvContext, useThreadContext } from '../contexts/AssistantContext';
import { createSuggestions } from '../runtime/suggestions';

const EmptyState = () => {
    const { i18n, locale, routePath } = useEnvContext();
    const { setPrompt } = useThreadContext();
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            setSuggestions(createSuggestions({ i18n, locale, routePath }));

            return undefined;
        }

        const frameId = window.requestAnimationFrame(() => {
            setSuggestions(createSuggestions({ i18n, locale, routePath }));
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [i18n, locale, routePath]);

    return (
        <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <div className="size-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                <DynamicIcon name="message" variant="filled" className="text-[22px]" />
            </div>
            <p className="m-0 text-md text-subtle">{i18n.t('assistant.empty', { language: locale })}</p>
            {suggestions.length > 0 && (
                <div className="flex max-w-74 flex-wrap justify-center gap-1.5">
                    {suggestions.map(suggestion => (
                        <button
                            key={suggestion}
                            className="h-6 rounded-md bg-muted px-2 text-sm leading-6 text-muted transition-colors cursor-pointer hover:bg-muted-hover hover:text-main"
                            type="button"
                            onClick={() => setPrompt(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default memo(EmptyState);
