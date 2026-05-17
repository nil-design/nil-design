import { ReflectionKind } from 'typedoc';
import type { DeclarationReflection } from 'typedoc';

export const isCallableReflection = (reflection: DeclarationReflection) => {
    return reflection.kind === ReflectionKind.Function || !!reflection.signatures?.length;
};
