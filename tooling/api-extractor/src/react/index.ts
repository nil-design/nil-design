import type { ApiComponentItem, ApiType, ReactExtractOptions } from '../interfaces';
import type { DeclarationReflection, Reflection, SomeType } from 'typedoc';

export type ReactComponentPattern = ApiComponentItem['react']['pattern'];

export interface RawReactComponentTypes {
    pattern: ReactComponentPattern;
    propsType?: SomeType;
    displayPropsType?: SomeType;
    refType?: SomeType;
}

export interface ReactComponentTypes {
    pattern: ReactComponentPattern;
    propsObject?: ApiType;
    propsType?: ApiType;
    refType?: ApiType;
}

const defaultComponentNamePattern = /^[A-Z]/;
const defaultHookNamePattern = /^use[A-Z0-9]/;
const functionComponentNames = new Set(['FC', 'FunctionComponent', 'VFC', 'VoidFunctionComponent']);
const forwardRefNames = new Set(['ForwardRefExoticComponent']);
const memoNames = new Set(['MemoExoticComponent']);
const lazyNames = new Set(['LazyExoticComponent']);

export const isHookName = (name: string, options: ReactExtractOptions = {}) => {
    return (options.hookNamePattern ?? defaultHookNamePattern).test(name);
};

export const isComponentName = (name: string, options: ReactExtractOptions = {}) => {
    return (options.componentNamePattern ?? defaultComponentNamePattern).test(name);
};

const getPropsTypeFromReflection = (type: SomeType | undefined): SomeType | undefined => {
    if (!type) return undefined;

    const reflection = type.type === 'reference' ? type.reflection : undefined;
    const declaration = reflection as (Reflection & { type?: SomeType }) | undefined;

    if (!declaration || declaration.variant !== 'declaration') return undefined;
    if (declaration.type) return declaration.type;

    return {
        type: 'reflection',
        declaration,
    } as SomeType;
};

const extractPropsAndRefFromForwardRefType = (
    type: SomeType | undefined,
): [SomeType | undefined, SomeType | undefined] => {
    if (!type) return [undefined, undefined];

    if (type.type === 'intersection') {
        const [rawPropsType, refAttributesType] = type.types;
        const propsType = rawPropsType ? (getPropsTypeFromReflection(rawPropsType) ?? rawPropsType) : undefined;
        const refType =
            refAttributesType?.type === 'reference' &&
            'typeArguments' in refAttributesType &&
            Array.isArray(refAttributesType.typeArguments)
                ? refAttributesType.typeArguments[0]
                : undefined;

        return [propsType, refType];
    }

    return [getPropsTypeFromReflection(type) ?? type, undefined];
};

const getReferenceComponentTypes = (
    type: SomeType,
    options: ReactExtractOptions = {},
): RawReactComponentTypes | undefined => {
    if (type.type !== 'reference') return undefined;

    const typeArguments = 'typeArguments' in type && Array.isArray(type.typeArguments) ? type.typeArguments : [];
    const customWrapper = options.customComponentWrappers?.find(wrapper => wrapper.name === type.name);

    if (customWrapper) {
        return {
            pattern: 'exotic',
            propsType:
                getPropsTypeFromReflection(typeArguments[customWrapper.propsTypeArgumentIndex ?? 0]) ??
                typeArguments[customWrapper.propsTypeArgumentIndex ?? 0],
            displayPropsType: typeArguments[customWrapper.propsTypeArgumentIndex ?? 0],
            refType: typeArguments[customWrapper.refTypeArgumentIndex ?? 1],
        };
    }

    if (functionComponentNames.has(type.name)) {
        return {
            pattern: 'fc',
            propsType: getPropsTypeFromReflection(typeArguments[0]) ?? typeArguments[0],
            displayPropsType: typeArguments[0],
        };
    }

    if (forwardRefNames.has(type.name)) {
        const [propsType, refType] = extractPropsAndRefFromForwardRefType(typeArguments[0]);

        return {
            pattern: 'forwardRef',
            propsType,
            displayPropsType: propsType,
            refType,
        };
    }

    if (memoNames.has(type.name)) {
        return {
            pattern: 'memo',
            propsType: getPropsTypeFromReflection(typeArguments[0]) ?? typeArguments[0],
            displayPropsType: typeArguments[0],
        };
    }

    if (lazyNames.has(type.name)) {
        return {
            pattern: 'lazy',
            propsType: getPropsTypeFromReflection(typeArguments[0]) ?? typeArguments[0],
            displayPropsType: typeArguments[0],
        };
    }

    return undefined;
};

const getReflectionComponentTypes = (type: SomeType): RawReactComponentTypes | undefined => {
    if (type.type !== 'reflection') return undefined;

    const [signature] = type.declaration.signatures ?? [];
    const [parameter] = signature?.parameters ?? [];

    if (!signature) return undefined;

    if (parameter?.type?.type === 'intersection') {
        const [rawPropsType, refAttributesType] = parameter.type.types;
        const propsType = rawPropsType ? (getPropsTypeFromReflection(rawPropsType) ?? rawPropsType) : undefined;
        const refType =
            refAttributesType?.type === 'reference' &&
            'typeArguments' in refAttributesType &&
            Array.isArray(refAttributesType.typeArguments)
                ? refAttributesType.typeArguments[0]
                : undefined;

        return {
            pattern: 'forwardRef',
            propsType,
            displayPropsType: rawPropsType,
            refType,
        };
    }

    return {
        pattern: 'function',
        propsType: getPropsTypeFromReflection(parameter?.type) ?? parameter?.type,
        displayPropsType: parameter?.type,
    };
};

export const analyzeReactComponentTypes = (
    reflection: DeclarationReflection,
    options: ReactExtractOptions = {},
): RawReactComponentTypes | undefined => {
    const componentType = reflection.type;

    if (!componentType) return undefined;

    if (componentType.type === 'intersection') {
        let result: RawReactComponentTypes | undefined;

        for (const type of componentType.types) {
            result = getReferenceComponentTypes(type, options) ?? getReflectionComponentTypes(type) ?? result;
        }

        return result;
    }

    return getReferenceComponentTypes(componentType, options) ?? getReflectionComponentTypes(componentType);
};

export const findCompoundComponentReflections = (reflection: DeclarationReflection): DeclarationReflection[] => {
    const componentType = reflection.type;
    const compounds: DeclarationReflection[] = [];

    if (!componentType || componentType.type !== 'intersection') return compounds;

    const objectReflection = componentType.types.find(
        type => type.type === 'reflection' && Array.isArray(type.declaration.children),
    );

    if (!objectReflection || objectReflection.type !== 'reflection') return compounds;

    for (const child of objectReflection.declaration.children ?? []) {
        if (child.variant !== 'declaration' || !child.type) continue;

        compounds.push(child);
    }

    return compounds;
};
