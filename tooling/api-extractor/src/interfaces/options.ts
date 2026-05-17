import type { ApiItem, ApiProject } from './schema';

export interface ExtractProjectOptions {
    cwd?: string;
    entryPoints: string[];
    tsconfig?: string;
    exclude?: string[];
    includePrivate?: boolean;
    includeProtected?: boolean;
    includeExternalDeclarations?: boolean;
    comments?: CommentExtractOptions;
    reactComponents?: ReactExtractOptions;
    filters?: ApiFilterOptions;
    transforms?: ApiTransform[];
    diagnostics?: DiagnosticOptions;
}

export interface CommentExtractOptions {
    includeSummary?: boolean;
    includeBlockTags?: boolean;
    includeModifierTags?: boolean;
}

export interface ReactExtractOptions {
    componentNamePattern?: RegExp;
    hookNamePattern?: RegExp;
    customComponentWrappers?: ReactWrapperPattern[];
    customHookClassifiers?: ApiClassifier[];
}

export interface ReactWrapperPattern {
    name: string;
    propsTypeArgumentIndex?: number;
    refTypeArgumentIndex?: number;
}

export type ApiClassifier = (context: ApiClassifierContext) => boolean;

export interface ApiClassifierContext {
    item: ApiItem;
    project: ApiProject;
}

export interface ApiFilterOptions {
    includeNames?: Array<string | RegExp>;
    excludeNames?: Array<string | RegExp>;
    includeKinds?: ApiItem['kind'][];
    excludeKinds?: ApiItem['kind'][];
    includeTags?: string[];
    excludeTags?: string[];
    includeSourcePaths?: Array<string | RegExp>;
    excludeSourcePaths?: Array<string | RegExp>;
}

export type ApiTransform = (item: ApiItem, context: ApiTransformContext) => ApiItem | undefined;

export interface ApiTransformContext {
    project: ApiProject;
    options: ExtractProjectOptions;
}

export interface DiagnosticOptions {
    missingEntryPoint?: 'ignore' | 'warning' | 'error';
    unknownExport?: 'ignore' | 'warning' | 'error';
}
