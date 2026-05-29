import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import i18n from '../../../../../../locales/index';
import { normalizeModelId } from '../runtime/model';
import { createThreadMessage } from '../runtime/thread';
import { createDocService } from '../services/docs';
import {
    DEFAULT_MODEL_ID,
    clearSession,
    composeChatRequestMessages,
    createEmptySession,
    createOpenRouterService,
    loadSession,
    saveSession,
} from '../services/openrouter';

const openRouter = createOpenRouterService();
const docService = createDocService();

export const useRuntime = ({ base, locale, onOpen }) => {
    const [session, setSession] = useState(() =>
        typeof window === 'undefined' ? createEmptySession() : loadSession(),
    );
    const [modelDraft, setModelDraft] = useState(session.model || DEFAULT_MODEL_ID);
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState('');
    const [contextWarning, setContextWarning] = useState('');
    const abortRef = useRef(null);
    const handledCallbackRef = useRef('');
    const connected = !!session.key;

    const persistSession = useCallback(nextSession => {
        const saved = saveSession(nextSession);

        setSession(saved);
        setModelDraft(saved.model);
    }, []);

    useEffect(() => {
        const finishOAuth = async () => {
            const callbackSearch = window.location.search;
            const hasCallback = new URLSearchParams(callbackSearch).has('code');

            if (!hasCallback) {
                return;
            }
            if (handledCallbackRef.current === callbackSearch) {
                return;
            }

            handledCallbackRef.current = callbackSearch;

            onOpen?.();
            setConnecting(true);
            setError('');

            try {
                const key = await openRouter.completeAuthCallback();
                const saved = saveSession({
                    key,
                    model: normalizeModelId(modelDraft || session.model),
                    remember: session.remember,
                });

                setSession(saved);
                setModelDraft(saved.model);
                openRouter.removeAuthParams();
            } catch {
                setError(i18n.t('assistant.openrouter.auth.failed', { language: locale }));
                openRouter.clearPendingAuth();
                openRouter.removeAuthParams();
            } finally {
                setConnecting(false);
            }
        };

        finishOAuth();
    }, [locale, modelDraft, onOpen, session.model, session.remember]);

    const connect = useCallback(async () => {
        setConnecting(true);
        setError('');

        try {
            const nextSession = saveSession({
                ...session,
                model: normalizeModelId(modelDraft),
            });
            const authUrl = await openRouter.buildAuthUrl();

            setSession(nextSession);
            window.location.assign(authUrl);
        } catch {
            setConnecting(false);
            setError(i18n.t('assistant.openrouter.auth.failed', { language: locale }));
        }
    }, [locale, modelDraft, session]);

    const setRemember = useCallback(
        value => {
            persistSession({
                ...session,
                model: normalizeModelId(modelDraft),
                remember: value,
            });
        },
        [modelDraft, persistSession, session],
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
        abortRef.current?.abort();
        clearSession();
        openRouter.clearPendingAuth();
        openRouter.removeAuthParams();
        setSession(createEmptySession());
        setModelDraft(DEFAULT_MODEL_ID);
        setMessages([]);
        setPrompt('');
        setError('');
        setContextWarning('');
        setGenerating(false);
    }, []);

    const send = useCallback(async () => {
        const content = prompt.trim();

        if (!content || !connected || generating) {
            return;
        }

        setPrompt('');
        setError('');
        setContextWarning('');

        const userMessage = createThreadMessage({ role: 'user', content });
        const assistantMessage = createThreadMessage({ role: 'assistant', content: '' });
        const history = messages.filter(message => message.content.trim());

        setMessages(current => [...current, userMessage, assistantMessage]);
        setGenerating(true);

        const controller = new AbortController();

        abortRef.current = controller;

        try {
            const docResult = await docService.retrieve({ base, locale, query: content });

            if (!docResult.loaded) {
                setContextWarning(i18n.t('assistant.context.unavailable', { language: locale }));
            }

            const stream = await openRouter.createChatStream({
                key: session.key,
                model: normalizeModelId(modelDraft),
                signal: controller.signal,
                messages: composeChatRequestMessages({
                    history,
                    locale,
                    userContent: content,
                    docContext: docResult.context,
                }),
            });

            for await (const delta of stream) {
                setMessages(current =>
                    current.map(message =>
                        message.id === assistantMessage.id
                            ? {
                                  ...message,
                                  content: `${message.content}${delta}`,
                              }
                            : message,
                    ),
                );
            }

            setMessages(current =>
                current.map(message =>
                    message.id === assistantMessage.id
                        ? {
                              ...message,
                              sources: docResult.sources,
                          }
                        : message,
                ),
            );
        } catch (reason) {
            if (reason?.name !== 'AbortError') {
                const chatFailed = i18n.t('assistant.error.msg', { language: locale });

                setMessages(current =>
                    current.map(message =>
                        message.id === assistantMessage.id
                            ? {
                                  ...message,
                                  content: chatFailed,
                                  status: 'error',
                              }
                            : message,
                    ),
                );
            }
        } finally {
            setGenerating(false);
            abortRef.current = null;
        }
    }, [base, connected, generating, locale, messages, modelDraft, prompt, session.key]);

    return useMemo(
        () => ({
            connected,
            connecting,
            contextWarning,
            error,
            generating,
            messages,
            model: modelDraft,
            prompt,
            remember: session.remember,
            connect,
            disconnect,
            send,
            setModel,
            setPrompt,
            setRemember,
        }),
        [
            connected,
            connecting,
            contextWarning,
            connect,
            disconnect,
            error,
            generating,
            messages,
            modelDraft,
            prompt,
            send,
            session.remember,
            setModel,
            setRemember,
        ],
    );
};
