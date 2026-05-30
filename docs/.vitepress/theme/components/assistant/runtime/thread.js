let messageId = 0;

export const createThreadMessage = ({ role, content, sources = [], status = 'default' }) => ({
    id: ++messageId,
    role,
    content,
    sources,
    status,
});

export const patchMessage = (messages, id, patch) =>
    messages.map(message => {
        if (message.id !== id) {
            return message;
        }

        return {
            ...message,
            ...(typeof patch === 'function' ? patch(message) : patch),
        };
    });

export const appendDelta = (messages, id, delta) =>
    patchMessage(messages, id, message => ({
        content: `${message.content}${delta}`,
    }));
