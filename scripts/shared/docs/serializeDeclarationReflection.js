import { ReflectionKind } from 'typedoc';
import serializeComment from './serializeComment.js';
import serializeType from './serializeType.js';

/**
 * @param {import('typedoc').DeclarationReflection} declarationReflection
 */
const serializeDeclarationReflection = declarationReflection => {
    if (!declarationReflection || declarationReflection.variant !== 'declaration') {
        return;
    } else {
        const props = [];
        const { type, extendedTypes = [], children } = declarationReflection;

        if (!children && type?.type === 'reference') {
            // type XXX = YYY
            return {
                name: declarationReflection.escapedName,
                equalType: serializeType(type),
            };
        }

        for (const propReflection of children) {
            if (propReflection.kind !== ReflectionKind.Property) continue;
            if (propReflection.inheritedFrom) continue;

            const { tags } = serializeComment(propReflection);
            const defaultTag = tags['@default'];
            const descTag = tags['@description'];

            props.push({
                id: propReflection.id,
                name: propReflection.escapedName,
                type: serializeType(propReflection.type),
                optional: propReflection.flags.isOptional,
                description: descTag?.text ?? '',
                defaultValue: defaultTag?.text ?? '',
            });
        }

        // restore the declaration order
        props.sort((a, b) => a.id - b.id);

        return {
            name: declarationReflection.escapedName,
            extendTypes: extendedTypes.map(type => serializeType(type)),
            props,
        };
    }
};

export default serializeDeclarationReflection;
