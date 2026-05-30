import { useCallback, useEffect, useRef, useState } from 'react';
import i18n from '../../../../../../locales/index';
import { normalizeModelId } from '../runtime/model';
import {
    DEFAULT_MODEL_ID,
    clearSession,
    createEmptySession,
    createOpenRouterService,
    loadSession,
    saveSession,
} from '../services/openrouter';

const openRouter = createOpenRouterService();

export const useSession = ({ locale, onOpen, service = openRouter }) => {
    const [session, setSession] = useState(() =>
        typeof window === 'undefined' ? createEmptySession() : loadSession(),
    );
    const [model, setModelDraft] = useState(session.model || DEFAULT_MODEL_ID);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState('');
    const handledCallbackRef = useRef('');
    const connected = !!session.key;

    const clearError = useCallback(() => {
        setError('');
    }, []);

    const persistSession = useCallback(nextSession => {
        const saved = saveSession(nextSession);

        setSession(saved);
        setModelDraft(saved.model);

        return saved;
    }, []);

    useEffect(() => {
        const finishOAuth = async () => {
            const callbackSearch = window.location.search;
            const hasCallback = new URLSearchParams(callbackSearch).has('code');

            if (!hasCallback || handledCallbackRef.current === callbackSearch) {
                return;
            }

            handledCallbackRef.current = callbackSearch;

            onOpen?.();
            setConnecting(true);
            setError('');

            try {
                const key = await service.completeAuthCallback();

                persistSession({
                    key,
                    model: normalizeModelId(model || session.model),
                    remember: session.remember,
                });
                service.removeAuthParams();
            } catch {
                setError(i18n.t('assistant.openrouter.auth.failed', { language: locale }));
                service.clearPendingAuth();
                service.removeAuthParams();
            } finally {
                setConnecting(false);
            }
        };

        finishOAuth();
    }, [locale, model, onOpen, persistSession, service, session.model, session.remember]);

    const connect = useCallback(async () => {
        setConnecting(true);
        setError('');

        try {
            const nextSession = saveSession({
                ...session,
                model: normalizeModelId(model),
            });
            const authUrl = await service.buildAuthUrl();

            setSession(nextSession);
            window.location.assign(authUrl);
        } catch {
            setConnecting(false);
            setError(i18n.t('assistant.openrouter.auth.failed', { language: locale }));
        }
    }, [locale, model, service, session]);

    const setRemember = useCallback(
        value => {
            persistSession({
                ...session,
                model: normalizeModelId(model),
                remember: value,
            });
        },
        [model, persistSession, session],
    );

    const setModel = useCallback(
        value => {
            setModelDraft(value);

            if (connected) {
                persistSession({
                    ...session,
                    model: normalizeModelId(value),
                });
            }
        },
        [connected, persistSession, session],
    );

    const disconnect = useCallback(() => {
        clearSession();
        service.clearPendingAuth();
        service.removeAuthParams();
        setSession(createEmptySession());
        setModelDraft(DEFAULT_MODEL_ID);
        setConnecting(false);
        setError('');
    }, [service]);

    return {
        clearError,
        connect,
        connected,
        connecting,
        disconnect,
        error,
        key: session.key,
        model,
        remember: session.remember,
        setModel,
        setRemember,
    };
};
