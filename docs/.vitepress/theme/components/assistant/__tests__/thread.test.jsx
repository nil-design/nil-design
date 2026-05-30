// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useThread } from '../hooks/useThread';
import { appendDelta, createThreadMessage, patchMessage } from '../runtime/thread';

const createStream = async function* (deltas) {
    for (const delta of deltas) {
        yield delta;
    }
};

describe('assistant thread runtime', () => {
    it('patches and appends message content by id', () => {
        const first = createThreadMessage({ role: 'user', content: 'Hello' });
        const second = createThreadMessage({ role: 'assistant', content: '' });
        const messages = [first, second];

        expect(appendDelta(messages, second.id, 'Hi')).toEqual([
            first,
            expect.objectContaining({ id: second.id, content: 'Hi' }),
        ]);
        expect(patchMessage(messages, second.id, { sources: [{ path: '/button/' }] })).toEqual([
            first,
            expect.objectContaining({ id: second.id, sources: [{ path: '/button/' }] }),
        ]);
    });

    it('sends a prompt with docs context and attaches streamed response sources', async () => {
        const docs = {
            retrieve: vi.fn().mockResolvedValue({
                loaded: true,
                context: 'Button docs',
                sources: [{ title: 'Button', path: '/components/button/' }],
            }),
        };
        const service = {
            createChatStream: vi.fn().mockResolvedValue(createStream(['Hello', ' world'])),
        };
        const clearError = vi.fn();
        const { result } = renderHook(() =>
            useThread({
                base: '/',
                clearError,
                connected: true,
                docs,
                key: 'sk-test',
                locale: 'en-US',
                model: 'openrouter/free',
                service,
            }),
        );

        act(() => result.current.setPrompt(' Button? '));
        await act(async () => result.current.send());

        await waitFor(() => expect(result.current.generating).toBe(false));
        expect(clearError).toHaveBeenCalledTimes(1);
        expect(docs.retrieve).toHaveBeenCalledWith({ base: '/', locale: 'en-US', query: 'Button?' });
        expect(service.createChatStream).toHaveBeenCalledWith(
            expect.objectContaining({
                key: 'sk-test',
                model: 'openrouter/free',
                messages: expect.arrayContaining([
                    expect.objectContaining({
                        role: 'user',
                        content: expect.stringContaining('Button docs'),
                    }),
                ]),
            }),
        );
        expect(result.current.messages).toEqual([
            expect.objectContaining({ role: 'user', content: 'Button?' }),
            expect.objectContaining({
                role: 'assistant',
                content: 'Hello world',
                sources: [{ title: 'Button', path: '/components/button/' }],
            }),
        ]);
    });

    it('keeps aborts silent and writes ordinary failures to the assistant message', async () => {
        const docs = {
            retrieve: vi.fn().mockResolvedValue({
                loaded: true,
                context: '',
                sources: [],
            }),
        };
        const service = {
            createChatStream: vi.fn().mockRejectedValue(Object.assign(new Error('aborted'), { name: 'AbortError' })),
        };
        const { result, rerender } = renderHook(
            ({ streamService }) =>
                useThread({
                    base: '/',
                    connected: true,
                    docs,
                    key: 'sk-test',
                    locale: 'en-US',
                    model: 'openrouter/free',
                    service: streamService,
                }),
            { initialProps: { streamService: service } },
        );

        act(() => result.current.setPrompt('Abort'));
        await act(async () => result.current.send());

        expect(result.current.messages.at(-1)).toMatchObject({
            role: 'assistant',
            content: '',
            status: 'default',
        });

        rerender({
            streamService: {
                createChatStream: vi.fn().mockRejectedValue(new Error('failed')),
            },
        });
        act(() => result.current.setPrompt('Fail'));
        await act(async () => result.current.send());

        expect(result.current.messages.at(-1)).toMatchObject({
            role: 'assistant',
            status: 'error',
        });
        expect(result.current.messages.at(-1).content).toBeTruthy();
    });
});
