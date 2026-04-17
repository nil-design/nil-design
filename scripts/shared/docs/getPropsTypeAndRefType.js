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
 * @param {import('typedoc').SomeType} componentType
 * @returns {[import('typedoc').SomeType, import('typedoc').SomeType | undefined]}
 */
const getPropsAndRefTypeFromReflectionComponentType = componentType => {
    const { declaration } = componentType;
    const [signatureReflection] = declaration.signatures || [];
    const [parameterReflection] = signatureReflection?.parameters || [];
    let propsType;
    let refType;

    if (!parameterReflection?.type) {
        return [];
    }

    if (parameterReflection.type.type === 'intersection') {
        // parameters of forwardRefWithGenerics
        propsType = parameterReflection.type.types[0];
        refType = parameterReflection.type.types[1].typeArguments[0];
    } else if (parameterReflection.type.type === 'reference') {
        propsType = parameterReflection.type;
    }

    return [propsType, refType];
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
            let nextPropsType;
            let nextRefType;

            if (type.type === 'reference') {
                if (['FC', 'FunctionComponent'].includes(type.name)) {
                    [nextPropsType] = getPropsTypeFromFunctionComponentType(type);
                } else if (type.name === 'ForwardRefExoticComponent') {
                    [nextPropsType, nextRefType] = getPropsAndRefTypeFromForwardRefExoticComponentType(type);
                }
            } else if (type.type === 'reflection') {
                [nextPropsType, nextRefType] = getPropsAndRefTypeFromReflectionComponentType(type);
            }

            if (nextPropsType) {
                propsType = nextPropsType;
            }
            if (nextRefType) {
                refType = nextRefType;
            }
        });
    } else if (componentType.type === 'reflection') {
        [propsType, refType] = getPropsAndRefTypeFromReflectionComponentType(componentType);
    }

    return [propsType, refType];
};

export default getPropsTypeAndRefType;
