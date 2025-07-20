/**
 * @param {import('typedoc').SomeType} componentType
 * @returns {[import('typedoc').SomeType]}
 */
const getPropsTypeFromFunctionComponentType = componentType => {
    // [propsType]
    return componentType.typeArguments;
};

/**
 * @param {import('typedoc').SomeType} componentType
 * @returns {[import('typedoc').SomeType, import('typedoc').SomeType | undefined]}
 */
const getPropsAndRefTypeFromForwardRefExoticComponentType = componentType => {
    const [argType] = componentType.typeArguments;
    if (argType) {
        if (argType.type === 'intersection') {
            // [propsType, refType]
            return argType.types;
        } else if (argType.type === 'reference') {
            // when the ref type is HTMLElement, there will just be a propsType
            // [propsType]
            return [argType];
        }
    }

    return [];
};

/**
 * @param {import('typedoc').DeclarationReflection} componentReflection
 * @returns {[import('typedoc').SomeType, import('typedoc').SomeType | undefined]}
 */
const getPropsTypeAndRefType = componentReflection => {
    const { type: componentType } = componentReflection;
    let propsType;
    let refType;

    if (componentType.type === 'reference') {
        if (['FC', 'FunctionComponent'].includes(componentType.name)) {
            [propsType] = getPropsTypeFromFunctionComponentType(componentType);
        } else if (componentType.name === 'ForwardRefExoticComponent') {
            [propsType, refType] = getPropsAndRefTypeFromForwardRefExoticComponentType(componentType);
        }
    } else if (componentType.type === 'intersection') {
        componentType.types.forEach(type => {
            if (type.type === 'reference') {
                if (['FC', 'FunctionComponent'].includes(type.name)) {
                    [propsType] = getPropsTypeFromFunctionComponentType(type);
                } else if (type.name === 'ForwardRefExoticComponent') {
                    [propsType, refType] = getPropsAndRefTypeFromForwardRefExoticComponentType(type);
                }
            }
        });
    } else if (componentType.type === 'reflection') {
        const { declaration } = componentType;
        const [signatureReflection] = declaration.signatures || [];
        const [parameterReflection] = signatureReflection.parameters;
        if (parameterReflection.type.type === 'intersection') {
            // parameters of forwardRefWithGenerics
            propsType = parameterReflection.type.types[0];
            refType = parameterReflection.type.types[1].typeArguments[0];
        }
    }

    return [propsType, refType];
};

export default getPropsTypeAndRefType;
