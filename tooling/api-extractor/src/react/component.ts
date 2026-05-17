import { serializeBaseReflection } from '../core/serializers/itemBase';
import { getCallSignatures } from '../core/serializers/member';
import type { ReactAnalyzer } from './classifiers';
import type { RawReactComponentTypes, ReactComponentTypes } from './index';
import type { TypeSerializer } from '../core/serializers/type';
import type { ApiComponentItem, ApiItemBase, ExtractProjectOptions } from '../interfaces';
import type { DeclarationReflection } from 'typedoc';

const serializeReactComponentTypes = (
    types: RawReactComponentTypes,
    typeSerializer: TypeSerializer,
): ReactComponentTypes => ({
    pattern: types.pattern,
    propsObject: types.propsType ? typeSerializer.serialize(types.propsType) : undefined,
    propsType: types.displayPropsType ? typeSerializer.serialize(types.displayPropsType) : undefined,
    refType: types.refType ? typeSerializer.serialize(types.refType) : undefined,
});

export const serializeComponent = (
    reflection: DeclarationReflection,
    base: ApiItemBase,
    rawReactTypes: RawReactComponentTypes,
    options: ExtractProjectOptions,
    typeSerializer: TypeSerializer,
    reactAnalyzer: ReactAnalyzer,
): ApiComponentItem => {
    const reactTypes = serializeReactComponentTypes(rawReactTypes, typeSerializer);
    const compounds = reactAnalyzer.getCompoundComponents(reflection).map(compound => {
        const compoundBase = {
            ...serializeBaseReflection(
                compound.reflection,
                base.entryPoint,
                options.cwd ?? process.cwd(),
                typeSerializer.context,
            ),
            name: `${base.name}.${compound.reflection.name}`,
            exportName: `${base.exportName}.${compound.reflection.name}`,
        };

        return serializeComponent(
            compound.reflection,
            compoundBase,
            compound.reactTypes,
            options,
            typeSerializer,
            reactAnalyzer,
        );
    });

    return {
        ...base,
        kind: 'component',
        react: {
            pattern: reactTypes.pattern,
        },
        propsObject: reactTypes.propsObject?.kind === 'object' ? reactTypes.propsObject : undefined,
        propsType: reactTypes.propsType,
        refType: reactTypes.refType,
        compounds,
        callSignatures: getCallSignatures(reflection, typeSerializer),
    };
};
