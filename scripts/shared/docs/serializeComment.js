/**
 * @param {import('typedoc').CommentDisplayPart[]} content
 */
const serializeContent = content => {
    return content.reduce((text, part) => {
        if (part.kind === 'text') {
            text += part.text.trim();
        }

        return text;
    }, '');
};

/**
 * @param {import('typedoc').Reflection} reflection
 */
const serializeComment = reflection => {
    if (!reflection.comment) {
        return {
            summary: '',
            tags: {},
            flags: {},
        };
    }

    /** @type {Record<string, { text: string } | undefined>} */
    const tags = {};
    /** @type {Record<string, boolean>} */
    const flags = {};
    const { summary, blockTags = [], modifierTags = [] } = reflection.comment;

    for (const blockTag of blockTags) {
        tags[blockTag.tag] = {
            // extract and join the text from the content
            text: serializeContent(blockTag.content),
        };
    }

    for (const modifierTag of modifierTags) {
        flags[modifierTag.replace('@', '')] = true;
    }

    return {
        summary: serializeContent(summary),
        tags,
        flags,
    };
};

export default serializeComment;
