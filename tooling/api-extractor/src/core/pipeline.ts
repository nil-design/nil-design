import { getBlockTags } from '../_shared/tags';
import type {
    ApiDiagnostic,
    ApiFilterOptions,
    ApiItem,
    ApiProject,
    ApiTransformContext,
    ExtractProjectOptions,
} from '../interfaces';

const matchesPattern = (value: string, pattern: string | RegExp) => {
    return typeof pattern === 'string' ? value === pattern : pattern.test(value);
};

const matchesAny = (value: string | undefined, patterns: Array<string | RegExp> | undefined) => {
    return value ? (patterns?.some(pattern => matchesPattern(value, pattern)) ?? false) : false;
};

export const createUnknownExportDiagnostic = (
    item: ApiItem,
    options: ExtractProjectOptions,
): ApiDiagnostic | undefined => {
    const severity = options.diagnostics?.unknownExport ?? 'warning';

    if (severity === 'ignore' || item.kind !== 'unknown') return undefined;

    return {
        code: 'unknown-export',
        message: `Could not classify export: ${item.exportName}`,
        severity,
        itemId: item.id,
        source: item.source,
    };
};

export const isMatchingFilters = (item: ApiItem, filters: ApiFilterOptions | undefined) => {
    const blockTags = getBlockTags(item.comment);

    if (!filters) return true;
    if (filters.includeNames && !matchesAny(item.name, filters.includeNames)) return false;
    if (matchesAny(item.name, filters.excludeNames)) return false;
    if (filters.includeKinds && !filters.includeKinds.includes(item.kind)) return false;
    if (filters.excludeKinds?.includes(item.kind)) return false;
    if (filters.includeTags && !filters.includeTags.some(tag => blockTags.some(itemTag => itemTag.tag === tag)))
        return false;
    if (filters.excludeTags?.some(tag => blockTags.some(itemTag => itemTag.tag === tag))) return false;
    if (filters.includeSourcePaths && !matchesAny(item.source?.fileName, filters.includeSourcePaths)) return false;
    if (matchesAny(item.source?.fileName, filters.excludeSourcePaths)) return false;

    return true;
};

export const applyTransforms = (project: ApiProject, options: ExtractProjectOptions): ApiItem[] => {
    const context: ApiTransformContext = {
        project,
        options,
    };

    return project.items
        .map(item =>
            (options.transforms ?? []).reduce<ApiItem | undefined>((nextItem, transform) => {
                return nextItem ? transform(nextItem, context) : undefined;
            }, item),
        )
        .filter((item): item is ApiItem => !!item);
};
