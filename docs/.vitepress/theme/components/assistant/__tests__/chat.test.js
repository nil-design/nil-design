import { describe, expect, it } from 'vitest';
import { parseChatStream } from '../services/openrouter/chat.js';

const createStream = chunks => {
    const encoder = new TextEncoder();

    return new ReadableStream({
        start(controller) {
            for (const chunk of chunks) {
                controller.enqueue(encoder.encode(chunk));
            }

            controller.close();
        },
    });
};

const collect = async stream => {
    const pieces = [];

    for await (const delta of parseChatStream(stream)) {
        pieces.push(delta);
    }

    return pieces;
};

describe('openrouter chat stream parser', () => {
    it('parses streamed delta content and ignores DONE events', async () => {
        const stream = createStream([
            'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
            'data: {"choices":[{"delta":{"content":" world"}}]}\n\n',
            'data: [DONE]\n\n',
        ]);

        await expect(collect(stream)).resolves.toEqual(['Hello', ' world']);
    });

    it('handles event chunks split across reads', async () => {
        const stream = createStream([
            'data: {"choices":[{"delta"',
            ':{"content":"Split"}}]}\n\n',
            '\n',
            'data: [DONE]\n\n',
        ]);

        await expect(collect(stream)).resolves.toEqual(['Split']);
    });
});
