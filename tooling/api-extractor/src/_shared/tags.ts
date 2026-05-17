import type { ApiComment } from '../interfaces';

export const getBlockTags = (comment: ApiComment | undefined) => {
    return comment?.blockTags ?? [];
};

export const hasBlockTag = (comment: ApiComment | undefined, tag: string, text?: string) => {
    return getBlockTags(comment).some(
        blockTag => blockTag.tag === tag && (text === undefined || blockTag.text === text),
    );
};
