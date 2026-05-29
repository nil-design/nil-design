import { APP_TITLE, OPENROUTER_CHAT_URL } from './config';

export const DEFAULT_SYSTEM_PROMPT = `\
You are an assistant embedded in the Nil Design documentation site.

## What you can do
- Answer Nil Design documentation questions using the provided documentation context.
- Answer general React, frontend, and design-system questions.
- Explain implementation ideas concisely.

## Hard rules
1. If documentation context is provided, treat it as the authoritative Nil Design reference.
2. Never make up Nil Design component names, props, APIs, or behavior.
3. If the provided docs do not cover a Nil Design-specific answer, say the docs do not cover it.
4. Keep answers concise and practical.`;

const createHeaders = key => ({
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': APP_TITLE,
});

export const composeChatRequestMessages = ({ history, userContent, docContext, locale }) => {
    const contextMessage = docContext
        ? [
              '## Documentation context',
              'The following Nil Design documentation snippets come from the current locale.',
              'Prefer them over prior knowledge for Nil Design-specific details.',
              '',
              docContext,
          ].join('\n')
        : '';
    const localeMessage = locale
        ? [
              '## Response language',
              `The current documentation locale is ${locale}.`,
              'Prefer answering in the language used by this locale unless the user clearly asks for another language.',
          ].join('\n')
        : '';
    const userMessage = [localeMessage, contextMessage, `## User question\n${userContent}`]
        .filter(Boolean)
        .join('\n\n');

    return [
        { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
        ...history.map(({ role, content }) => ({ role, content })),
        {
            role: 'user',
            content: locale || contextMessage ? userMessage : userContent,
        },
    ];
};

export async function* parseChatStream(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split(/\n\n/u);

            buffer = events.pop() ?? '';

            for (const event of events) {
                const lines = event
                    .split(/\r?\n/u)
                    .map(line => line.trim())
                    .filter(line => line.startsWith('data:'));

                for (const line of lines) {
                    const data = line.replace(/^data:\s*/u, '');

                    if (!data || data === '[DONE]') {
                        continue;
                    }

                    const payload = JSON.parse(data);
                    const delta = payload?.choices?.[0]?.delta?.content ?? '';

                    if (delta) {
                        yield delta;
                    }
                }
            }
        }

        const tail = buffer.trim();

        if (tail.startsWith('data:') && !tail.includes('[DONE]')) {
            const payload = JSON.parse(tail.replace(/^data:\s*/u, ''));
            const delta = payload?.choices?.[0]?.delta?.content ?? '';

            if (delta) {
                yield delta;
            }
        }
    } finally {
        reader.releaseLock();
    }
}

export const createChatStream = async ({
    key,
    model,
    messages,
    signal,
    fetcher = fetch,
    temperature = 0.3,
    maxTokens = 1600,
}) => {
    const response = await fetcher(OPENROUTER_CHAT_URL, {
        method: 'POST',
        headers: createHeaders(key),
        signal,
        body: JSON.stringify({
            model,
            messages,
            stream: true,
            temperature,
            max_tokens: maxTokens,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenRouter chat failed with status ${response.status}.`);
    }
    if (!response.body) {
        throw new Error('OpenRouter chat did not return a stream.');
    }

    return parseChatStream(response.body);
};
