import type { ApiComment, ApiItemFlags, ApiSource, ApiTag, CommentExtractOptions } from '../../interfaces';
import type { CommentDisplayPart, Reflection } from 'typedoc';

const serializeParts = (parts: readonly CommentDisplayPart[] | undefined) => {
    return (parts ?? [])
        .map(part => {
            if (part.kind === 'text' || part.kind === 'code') return part.text;
            if (part.kind === 'inline-tag') return part.text;
            if (part.kind === 'relative-link') return part.text;

            return '';
        })
        .join('')
        .trim();
};

const defaultCommentOptions: Required<CommentExtractOptions> = {
    includeSummary: true,
    includeBlockTags: true,
    includeModifierTags: true,
};

export const resolveCommentOptions = (options: CommentExtractOptions | undefined = {}) => {
    return {
        ...defaultCommentOptions,
        ...options,
    };
};

export const serializeComment = (
    reflection: Reflection | undefined,
    options: CommentExtractOptions | undefined = {},
): ApiComment | undefined => {
    const comment = reflection?.comment;

    if (!comment) return undefined;

    const resolvedOptions = resolveCommentOptions(options);
    const blockTags: ApiTag[] = resolvedOptions.includeBlockTags
        ? comment.blockTags.map(tag => ({
              tag: tag.tag,
              name: tag.name,
              text: serializeParts(tag.content),
          }))
        : [];
    const modifierTags = resolvedOptions.includeModifierTags
        ? [...comment.modifierTags].map(tag => tag.replace(/^@/, ''))
        : [];
    const serialized = {
        summary: resolvedOptions.includeSummary ? serializeParts(comment.summary) : '',
        blockTags,
        modifierTags,
    };

    if (!serialized.summary && blockTags.length === 0 && modifierTags.length === 0) return undefined;

    return serialized;
};

export const getCommentTags = (comment: ApiComment | undefined): ApiTag[] => {
    return comment?.blockTags ?? [];
};

export const getTagText = (comment: ApiComment | undefined, ...tags: string[]) => {
    const normalizedTags = tags.map(tag => (tag.startsWith('@') ? tag : `@${tag}`));

    return comment?.blockTags.find(tag => normalizedTags.includes(tag.tag))?.text;
};

export const serializeSource = (reflection: Reflection | undefined): ApiSource | undefined => {
    const [source] =
        reflection && 'sources' in reflection && Array.isArray(reflection.sources) ? reflection.sources : [];

    if (!source) return undefined;

    return {
        fileName: source.fileName,
        line: source.line,
        character: source.character,
        url: source.url,
    };
};

export const serializeFlags = (reflection: Reflection): ApiItemFlags => {
    const flags = reflection.flags;
    const serialized: ApiItemFlags = {};

    if (flags.isPrivate) serialized.private = true;
    if (flags.isProtected) serialized.protected = true;
    if (flags.isPublic) serialized.public = true;
    if (flags.isStatic) serialized.static = true;
    if (flags.isExternal) serialized.external = true;
    if (flags.isOptional) serialized.optional = true;
    if (flags.isRest) serialized.rest = true;
    if (flags.isAbstract) serialized.abstract = true;
    if (flags.isConst) serialized.const = true;
    if (flags.isReadonly) serialized.readonly = true;
    if (flags.isInherited) serialized.inherited = true;
    if (reflection.isDeprecated()) serialized.deprecated = true;

    return serialized;
};
