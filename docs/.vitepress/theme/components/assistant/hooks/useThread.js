import { useCallback, useRef, useState } from 'react';
import i18n from '../../../../../../locales/index';
import { normalizeModelId } from '../runtime/model';
import { appendDelta, createThreadMessage, patchMessage } from '../runtime/thread';
import { createDocService } from '../services/docs';
import { composeChatRequestMessages, createOpenRouterService } from '../services/openrouter';

const openRouter = createOpenRouterService();
const docService = createDocService();

const requestFlushFrame = callback => {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        return window.requestAnimationFrame(callback);
    }

    return setTimeout(callback, 0);
};

const cancelFlushFrame = frameId => {
    if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(frameId);

        return;
    }

    clearTimeout(frameId);
};

export const useThread = ({
    base,
    clearError,
    connected,
    key,
    locale,
    model,
    docs = docService,
    service = openRouter,
}) => {
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [contextWarning, setContextWarning] = useState('');
    const abortRef = useRef(null);
    const frameRef = useRef(0);
    const pendingDeltaRef = useRef({
        id: null,
        content: '',
    });

    const flushDeltas = useCallback(() => {
        if (frameRef.current) {
            cancelFlushFrame(frameRef.current);
            frameRef.current = 0;
        }

        const pending = pendingDeltaRef.current;

        if (!pending.content || pending.id === null) {
            return;
        }

        pendingDeltaRef.current = {
            id: null,
            content: '',
        };
        setMessages(current => appendDelta(current, pending.id, pending.content));
    }, []);

    const clearPendingDeltas = useCallback(() => {
        if (frameRef.current) {
            cancelFlushFrame(frameRef.current);
            frameRef.current = 0;
        }

        pendingDeltaRef.current = {
            id: null,
            content: '',
        };
    }, []);

    const enqueueDelta = useCallback(
        (id, delta) => {
            if (!delta) {
                return;
            }

            if (pendingDeltaRef.current.id !== null && pendingDeltaRef.current.id !== id) {
                flushDeltas();
            }

            pendingDeltaRef.current = {
                id,
                content: `${pendingDeltaRef.current.content}${delta}`,
            };

            if (!frameRef.current) {
                frameRef.current = requestFlushFrame(flushDeltas);
            }
        },
        [flushDeltas],
    );

    const reset = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
        clearPendingDeltas();
        setMessages([]);
        setPrompt('');
        setContextWarning('');
        setGenerating(false);
    }, [clearPendingDeltas]);

    const send = useCallback(async () => {
        const content = prompt.trim();

        if (!content || !connected || generating) {
            return;
        }

        setPrompt('');
        clearError?.();
        setContextWarning('');

        const userMessage = createThreadMessage({ role: 'user', content });
        const assistantMessage = createThreadMessage({ role: 'assistant', content: '' });
        const history = messages.filter(message => message.content.trim());

        setMessages(current => [...current, userMessage, assistantMessage]);
        setGenerating(true);

        const controller = new AbortController();

        abortRef.current = controller;

        try {
            const docResult = await docs.retrieve({ base, locale, query: content });

            if (!docResult.loaded) {
                setContextWarning(i18n.t('assistant.context.unavailable', { language: locale }));
            }

            const stream = await service.createChatStream({
                key,
                model: normalizeModelId(model),
                signal: controller.signal,
                messages: composeChatRequestMessages({
                    history,
                    locale,
                    userContent: content,
                    docContext: docResult.context,
                }),
            });

            for await (const delta of stream) {
                enqueueDelta(assistantMessage.id, delta);
            }

            flushDeltas();
            setMessages(current => patchMessage(current, assistantMessage.id, { sources: docResult.sources }));
        } catch (reason) {
            flushDeltas();
            if (reason?.name !== 'AbortError') {
                const chatFailed = i18n.t('assistant.error.msg', { language: locale });

                setMessages(current =>
                    patchMessage(current, assistantMessage.id, {
                        content: chatFailed,
                        status: 'error',
                    }),
                );
            }
        } finally {
            setGenerating(false);
            if (abortRef.current === controller) {
                abortRef.current = null;
            }
        }
    }, [
        base,
        clearError,
        connected,
        docs,
        enqueueDelta,
        flushDeltas,
        generating,
        key,
        locale,
        messages,
        model,
        prompt,
        service,
    ]);

    return {
        contextWarning,
        generating,
        messages,
        prompt,
        reset,
        send,
        setPrompt,
    };
};
