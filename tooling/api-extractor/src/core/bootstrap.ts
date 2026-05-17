import { Application, TSConfigReader, TypeDocReader } from 'typedoc';
import { normalizePath, toAbsolute } from '../_shared/path';
import type { ExtractProjectOptions } from '../interfaces';

export const convertProject = async (entryPoints: string[], options: ExtractProjectOptions) => {
    const cwd = options.cwd ?? process.cwd();
    const application = await Application.bootstrap(
        {
            entryPoints: entryPoints.map(entryPoint => normalizePath(entryPoint)),
            tsconfig: options.tsconfig ? normalizePath(toAbsolute(cwd, options.tsconfig)) : undefined,
            exclude: options.exclude,
            skipErrorChecking: true,
            excludePrivate: !options.includePrivate,
            excludeProtected: !options.includeProtected,
            excludeExternals: !options.includeExternalDeclarations,
        },
        [new TypeDocReader(), new TSConfigReader()],
    );

    return application.convert();
};
