import type { ExtractProjectOptions } from '../interfaces';

const defaultOptions: Omit<ExtractProjectOptions, 'entryPoints'> = {
    cwd: process.cwd(),
    exclude: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**'],
    includePrivate: false,
    includeProtected: false,
    includeExternalDeclarations: true,
    comments: {
        includeSummary: true,
        includeBlockTags: true,
        includeModifierTags: true,
    },
    diagnostics: {
        missingEntryPoint: 'error',
        unknownExport: 'warning',
    },
};

export const resolveExtractProjectOptions = (options: ExtractProjectOptions): ExtractProjectOptions => {
    return {
        ...defaultOptions,
        ...options,
        entryPoints: options.entryPoints,
        comments: {
            ...defaultOptions.comments,
            ...options.comments,
        },
        reactComponents: {
            ...options.reactComponents,
        },
        diagnostics: {
            ...defaultOptions.diagnostics,
            ...options.diagnostics,
        },
    };
};
