import { isString } from 'lodash-es';
import { ReflectionKind } from 'typedoc';
import serializeDeclarationReflection from './serializeDeclarationReflection.js';

/**
 * @param {import('typedoc').SomeType} type
 * @returns {string}
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
            return ['literal', 'intrinsic'].includes(type.elementType?.type)
                ? `${serializeType(type.elementType)}[]`
                : `Array<${serializeType(type.elementType)}>`;
        case 'tuple':
            return `[${type.elements.map(type => serializeType(type)).join(', ')}]`;
        case 'reference': {
            // reflection will be resolved when the type is exported
            const typeReflection = type.reflection;

            if (typeReflection) {
                if (typeReflection.type) {
                    // has type means the reflection is a reference to a type
                    return serializeType(typeReflection.type);
                } else {
                    // no type means the reflection is an interface
                    return type.name;
                }
            } else {
                if (type.typeArguments?.length) {
                    return `${type.name}<${type.typeArguments.map(type => serializeType(type)).join(', ')}>`;
                } else {
                    return type.name;
                }
            }
        }
        case 'reflection': {
            if (type.declaration.signatures) {
                // function literal
                const [signatureReflection] = type.declaration.signatures;

                if (signatureReflection.kind === ReflectionKind.CallSignature) {
                    const serializedParameters = signatureReflection.parameters
                        .map(param => `${param.name}${param.flags.isOptional ? '?' : ''}: ${serializeType(param.type)}`)
                        .join(', ');
                    const serializedReturnType = serializeType(signatureReflection.type);

                    return `(${serializedParameters}) => ${serializedReturnType}`;
                }
            } else if (type.declaration.children) {
                // object literal
                const { props } = serializeDeclarationReflection(type.declaration);

                return `{ ${props.map(prop => `${prop.name}${prop.optional ? '?' : ''}: ${prop.type}`).join(', ')} }`;
            }

            return 'any';
        }
        case 'union':
            return type.types.map(type => serializeType(type)).join(' | ');
        case 'intersection':
            return type.types.map(type => serializeType(type)).join(' & ');
        default:
            return 'any';
    }
};

export default serializeType;
