import { hasDeclaration, hasTypeArguments } from '../reflectionGuards';
import { serializeCallSignature, serializeProperties } from './member';
import type {
    CommentExtractOptions,
    ApiArrayType,
    ApiFunctionType,
    ApiIntersectionType,
    ApiObjectType,
    ApiReferenceType,
    ApiTupleType,
    ApiType,
    ApiUnionType,
    ApiUnknownType,
} from '../../interfaces';
import type { DeclarationReflection, SomeType } from 'typedoc';

export interface TypeSerializerContext {
    includeInheritedProperties?: boolean;
    comments?: CommentExtractOptions;
}

export const unknownType = (text = 'unknown'): ApiUnknownType => ({
    kind: 'unknown',
    text,
});

const joinTypes = (types: ApiType[], separator: string) => {
    return types.map(type => type.text).join(separator);
};

export class TypeSerializer {
    private readonly typeCache = new WeakMap<SomeType, ApiType>();
    private readonly objectCache = new WeakMap<DeclarationReflection, ApiObjectType>();

    constructor(readonly context: TypeSerializerContext = {}) {}

    serialize(type: SomeType | undefined): ApiType {
        if (!type) return unknownType();

        const cached = this.typeCache.get(type);

        if (cached) return cached;

        const serialized = this.serializeUncached(type);

        this.typeCache.set(type, serialized);

        return serialized;
    }

    private serializeDeclarationAsObject(declaration: DeclarationReflection): ApiObjectType {
        const cached = this.objectCache.get(declaration);

        if (cached) return cached;

        const properties = serializeProperties(declaration, this);
        const callSignatures = (declaration.signatures ?? []).map(signature => serializeCallSignature(signature, this));
        const indexSignatures = (declaration.indexSignatures ?? []).map(signature =>
            serializeCallSignature(signature, this),
        );
        const extendedTypes = (declaration.extendedTypes ?? []).map(type => this.serialize(type));
        const type: ApiObjectType = {
            kind: 'object',
            text: '',
            properties,
            extends: extendedTypes,
            callSignatures,
            indexSignatures,
        };

        type.text =
            properties.length > 0
                ? `{ ${properties.map(prop => `${prop.name}${prop.optional ? '?' : ''}: ${prop.type.text}`).join('; ')} }`
                : '{}';

        this.objectCache.set(declaration, type);

        return type;
    }

    private serializeUncached(type: SomeType): ApiType {
        switch (type.type) {
            case 'intrinsic':
                return {
                    kind: 'intrinsic',
                    name: type.name,
                    text: type.name,
                };
            case 'literal': {
                const value = typeof type.value === 'bigint' ? `${type.value}` : type.value;

                return {
                    kind: 'literal',
                    value,
                    text: typeof value === 'string' ? `'${value}'` : `${value}`,
                };
            }
            case 'reference': {
                const reflection = type.reflection as { variant?: string; type?: SomeType } | undefined;

                if (reflection?.variant === 'declaration' && reflection.type) {
                    return this.serialize(reflection.type);
                }

                const typeArguments = hasTypeArguments(type)
                    ? type.typeArguments.map(typeArgument => this.serialize(typeArgument))
                    : [];

                return {
                    kind: 'reference',
                    name: type.name,
                    packageName: type.package,
                    typeArguments,
                    text: typeArguments.length > 0 ? `${type.name}<${joinTypes(typeArguments, ', ')}>` : type.name,
                } satisfies ApiReferenceType;
            }
            case 'array': {
                const elementType = this.serialize(type.elementType);

                return {
                    kind: 'array',
                    elementType,
                    text: ['intrinsic', 'literal'].includes(elementType.kind)
                        ? `${elementType.text}[]`
                        : `Array<${elementType.text}>`,
                } satisfies ApiArrayType;
            }
            case 'tuple': {
                const elements = type.elements.map(element => this.serialize(element));

                return {
                    kind: 'tuple',
                    elements,
                    text: `[${joinTypes(elements, ', ')}]`,
                } satisfies ApiTupleType;
            }
            case 'union': {
                const types = type.types.map(unionType => this.serialize(unionType));

                return {
                    kind: 'union',
                    types,
                    text: joinTypes(types, ' | '),
                } satisfies ApiUnionType;
            }
            case 'intersection': {
                const types = type.types.map(intersectionType => this.serialize(intersectionType));

                return {
                    kind: 'intersection',
                    types,
                    text: joinTypes(types, ' & '),
                } satisfies ApiIntersectionType;
            }
            case 'reflection': {
                if (type.declaration.signatures?.length) {
                    const callSignatures = type.declaration.signatures.map(signature =>
                        serializeCallSignature(signature, this),
                    );

                    return {
                        kind: 'function',
                        callSignatures,
                        text: callSignatures
                            .map(signature => {
                                const parameters = signature.parameters
                                    .map(
                                        parameter =>
                                            `${parameter.rest ? '...' : ''}${parameter.name}${parameter.optional ? '?' : ''}: ${parameter.type.text}`,
                                    )
                                    .join(', ');

                                return `(${parameters}) => ${signature.returnType.text}`;
                            })
                            .join(' | '),
                    } satisfies ApiFunctionType;
                }

                return this.serializeDeclarationAsObject(type.declaration);
            }
            case 'namedTupleMember': {
                const element = this.serialize(type.element);

                return {
                    kind: 'tuple',
                    elements: [element],
                    text: `${type.name}${type.isOptional ? '?' : ''}: ${element.text}`,
                };
            }
            case 'optional': {
                const elementType = this.serialize(type.elementType);

                return {
                    ...elementType,
                    text: `${elementType.text}?`,
                };
            }
            case 'rest': {
                const elementType = this.serialize(type.elementType);

                return {
                    ...elementType,
                    text: `...${elementType.text}`,
                };
            }
            case 'typeOperator': {
                const target = this.serialize(type.target);

                return {
                    kind: 'unknown',
                    text: `${type.operator} ${target.text}`,
                };
            }
            case 'query': {
                const queryType = this.serialize(type.queryType);

                return {
                    kind: 'unknown',
                    text: `typeof ${queryType.text}`,
                };
            }
            case 'predicate': {
                const targetType = type.targetType ? this.serialize(type.targetType) : undefined;

                return {
                    kind: 'unknown',
                    text: `${type.asserts ? 'asserts ' : ''}${type.name}${targetType ? ` is ${targetType.text}` : ''}`,
                };
            }
            case 'unknown':
                return unknownType(type.name);
            default:
                if (hasDeclaration(type)) return this.serializeDeclarationAsObject(type.declaration);

                return unknownType(type.toString());
        }
    }
}
