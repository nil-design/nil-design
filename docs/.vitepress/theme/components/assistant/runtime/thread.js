let messageId = 0;

export const createThreadMessage = ({ role, content, sources = [], status = 'default' }) => ({
    id: ++messageId,
    role,
    content,
    sources,
    status,
});
