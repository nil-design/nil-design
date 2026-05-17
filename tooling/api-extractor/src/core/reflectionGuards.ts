import type { DeclarationReflection, Reflection, SomeType } from 'typedoc';

export const isDeclarationReflection = (reflection: Reflection | undefined): reflection is DeclarationReflection => {
    return !!reflection && reflection.variant === 'declaration';
};

export const hasTypeArguments = (type: SomeType): type is SomeType & { typeArguments: SomeType[] } => {
    return 'typeArguments' in type && Array.isArray(type.typeArguments);
};

export const hasDeclaration = (type: SomeType): type is SomeType & { declaration: DeclarationReflection } => {
    return 'declaration' in type && isDeclarationReflection(type.declaration);
};
