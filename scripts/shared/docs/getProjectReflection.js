import { Application, TSConfigReader, TypeDocReader } from 'typedoc';

/**
 * @param {import('typedoc').TypeDocOptions} options
 */
const getProjectReflection = async ({
    exclude = ['**/*.test.tsx', '**/__tests__/**'],
    json = true,
    skipErrorChecking = true,
    excludePrivate = true,
    excludeProtected = true,
    excludeExternals = false,
    ...resetOptions
}) => {
    return (
        await Application.bootstrap(
            {
                exclude,
                json,
                skipErrorChecking,
                excludePrivate,
                excludeProtected,
                excludeExternals,
                ...resetOptions,
            },
            [new TypeDocReader(), new TSConfigReader()],
        )
    ).convert();
};

export default getProjectReflection;
