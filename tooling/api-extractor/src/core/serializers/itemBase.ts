import { relative } from 'node:path';
import { normalizePath } from '../../_shared/path';
import { serializeComment, serializeFlags, serializeSource } from './comment';
import type { TypeSerializerContext } from './type';
import type { ApiItemBase, ExtractProjectOptions } from '../../interfaces';
import type { DeclarationReflection } from 'typedoc';

export const createSerializerContext = (options: ExtractProjectOptions): TypeSerializerContext => ({
    comments: options.comments,
});

export const serializeBaseReflection = (
    reflection: DeclarationReflection,
    entryPoint: string,
    cwd: string,
    context: TypeSerializerContext,
): ApiItemBase => {
    const comment = serializeComment(reflection, context.comments);
    const source = serializeSource(reflection);

    return {
        id: `${entryPoint}:${reflection.id}:${reflection.name}`,
        kind: 'unknown',
        name: reflection.name,
        exportName: reflection.name,
        entryPoint,
        source: source
            ? {
                  ...source,
                  fileName: normalizePath(
                      source.fileName.startsWith(cwd) ? relative(cwd, source.fileName) : source.fileName,
                  ),
              }
            : undefined,
        comment,
        flags: serializeFlags(reflection),
    };
};
