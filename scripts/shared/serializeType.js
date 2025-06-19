import { isString } from 'lodash-es';
import { ReflectionKind } from 'typedoc';

/**
 * @param {import('typedoc').SomeType} type
 */
const serializeType = type => {
    if (!type || !type.type) {
        return 'any';
    }

    switch (type.type) {
        case 'literal':
            return isString(type.value) ? `'${type.value}'` : `${type.value}`;
        case 'intrinsic':
            return type.name;
        case 'array':
            return `${serializeType(type.elementType)}[]`;
        case 'tuple':
            return `[${type.elements.map(type => serializeType(type)).join(', ')}]`;
        case 'union':
            return type.types.map(type => serializeType(type)).join(' | ');
        case 'intersection':
            return type.types.map(type => serializeType(type)).join(' & ');
        case 'reference': {
            // reflection will be resolved when the type is exported
            const typeReflection = type.reflection;

            return typeReflection ? serializeType(typeReflection.type) : type.name;
        }
        case 'reflection': {
            const [signatureReflection] = type.declaration.signatures;

            // function
            if (signatureReflection.kind === ReflectionKind.CallSignature) {
                const serializedParameters = signatureReflection.parameters
                    .map(param => `${param.name}${param.flags.isOptional ? '?' : ''}: ${serializeType(param.type)}`)
                    .join(', ');
                const serializedReturnType = serializeType(signatureReflection.type);

                return `(${serializedParameters}) => ${serializedReturnType}`;
            }

            return 'any';
        }
        default:
            return 'any';
    }
};

export default serializeType;
