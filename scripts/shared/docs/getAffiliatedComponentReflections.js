import { ReflectionKind } from 'typedoc';

/**
 * @param {import('typedoc').DeclarationReflection} componentReflection
 * @returns {[import('typedoc').SomeType, import('typedoc').SomeType | undefined]}
 */
const getAffiliatedComponentReflections = componentReflection => {
    const { escapedName, type: componentType } = componentReflection;
    const affiliatedComponentReflections = [];

    if (componentType.type === 'intersection') {
        const objectReflection = componentType.types.find(type => type.type === 'reflection');
        if (objectReflection) {
            for (const reflection of objectReflection.declaration.children) {
                if (!reflection.type) continue;

                if (reflection.type.type === 'reference') {
                    if (['FC', 'FunctionComponent'].includes(reflection.type.name)) {
                        // override the escapedName using the name of the component which is affiliated as prefix
                        reflection.escapedName = `${escapedName}.${reflection.escapedName}`;
                        affiliatedComponentReflections.push(reflection);
                    } else if (reflection.type.name === 'ForwardRefExoticComponent') {
                        reflection.escapedName = `${escapedName}.${reflection.escapedName}`;
                        affiliatedComponentReflections.push(reflection);
                    }
                } else if (reflection.type.type === 'reflection') {
                    const { declaration } = reflection.type;
                    const [signatureReflection] = declaration.signatures || [];
                    if (signatureReflection?.kind === ReflectionKind.CallSignature) {
                        // function signature
                        reflection.escapedName = `${escapedName}.${reflection.escapedName}`;
                        affiliatedComponentReflections.push(reflection);
                    }
                }
            }
        }
    }

    return affiliatedComponentReflections;
};

export default getAffiliatedComponentReflections;
