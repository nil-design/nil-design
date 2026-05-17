import { ReflectionKind } from 'typedoc';
import { getTagText, serializeComment, serializeSource } from './comment';
import { unknownType } from './type';
import type { TypeSerializer } from './type';
import type { ApiCallSignature, ApiParameter, ApiProperty, ApiTypeParameter } from '../../interfaces';
import type { DeclarationReflection, SignatureReflection, TypeParameterReflection } from 'typedoc';

export const serializeTypeParameters = (
    typeParameters: TypeParameterReflection[] | undefined,
    typeSerializer: TypeSerializer,
): ApiTypeParameter[] => {
    return (typeParameters ?? []).map(typeParameter => ({
        name: typeParameter.name,
        constraint: typeParameter.type ? typeSerializer.serialize(typeParameter.type) : undefined,
        default: typeParameter.default ? typeSerializer.serialize(typeParameter.default) : undefined,
    }));
};

const serializeParameter = (
    parameter: NonNullable<SignatureReflection['parameters']>[number],
    typeSerializer: TypeSerializer,
): ApiParameter => {
    const comment = serializeComment(parameter, typeSerializer.context.comments);

    return {
        name: parameter.name,
        optional: parameter.flags.isOptional,
        rest: parameter.flags.isRest,
        type: parameter.type ? typeSerializer.serialize(parameter.type) : unknownType(),
        defaultValue: parameter.defaultValue ?? getTagText(comment, '@defaultValue', '@default'),
        comment,
        source: serializeSource(parameter),
    };
};

export const serializeCallSignature = (
    signature: SignatureReflection,
    typeSerializer: TypeSerializer,
): ApiCallSignature => {
    const comment = serializeComment(signature, typeSerializer.context.comments);

    return {
        name: signature.name === '__call' ? undefined : signature.name,
        parameters: (signature.parameters ?? []).map(parameter => serializeParameter(parameter, typeSerializer)),
        returnType: signature.type ? typeSerializer.serialize(signature.type) : unknownType('void'),
        typeParameters: serializeTypeParameters(signature.typeParameters, typeSerializer),
        comment,
        source: serializeSource(signature),
    };
};

export const serializeProperties = (
    declaration: DeclarationReflection,
    typeSerializer: TypeSerializer,
): ApiProperty[] => {
    return (declaration.children ?? [])
        .filter(child => child.kind === ReflectionKind.Property)
        .filter(child => typeSerializer.context.includeInheritedProperties || !child.inheritedFrom)
        .map((child, index) => {
            const comment = serializeComment(child, typeSerializer.context.comments);

            return {
                name: child.name,
                optional: child.flags.isOptional,
                readonly: child.flags.isReadonly,
                type: child.type ? typeSerializer.serialize(child.type) : unknownType(),
                comment,
                defaultValue: child.defaultValue ?? getTagText(comment, '@defaultValue', '@default'),
                inheritedFrom: child.inheritedFrom?.name,
                source: serializeSource(child),
                order: index,
            };
        })
        .sort((a, b) => {
            const left = a.source?.line;
            const right = b.source?.line;

            if (left !== undefined && right !== undefined && left !== right) return left - right;

            return a.order - b.order;
        })
        .map(propertyWithOrder => {
            return {
                name: propertyWithOrder.name,
                optional: propertyWithOrder.optional,
                readonly: propertyWithOrder.readonly,
                type: propertyWithOrder.type,
                comment: propertyWithOrder.comment,
                defaultValue: propertyWithOrder.defaultValue,
                inheritedFrom: propertyWithOrder.inheritedFrom,
                source: propertyWithOrder.source,
            };
        });
};

export const getCallSignatures = (
    reflection: DeclarationReflection,
    typeSerializer: TypeSerializer,
): ApiCallSignature[] => {
    const signatures: SignatureReflection[] = reflection.signatures ?? [];

    if (signatures.length > 0) return signatures.map(signature => serializeCallSignature(signature, typeSerializer));

    if (reflection.type?.type === 'reflection' && reflection.type.declaration.signatures?.length) {
        return reflection.type.declaration.signatures.map(signature =>
            serializeCallSignature(signature, typeSerializer),
        );
    }

    return [];
};
