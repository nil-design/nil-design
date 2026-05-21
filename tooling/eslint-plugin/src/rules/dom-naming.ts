import { getStaticName, getTypeAnnotation } from './_shared/boolean';
import type { Rule } from 'eslint';

type AnyNode = {
    type: string;
    [key: string]: unknown;
};

type TypeLike = {
    aliasSymbol?: { escapedName?: unknown; name?: unknown };
    symbol?: { escapedName?: unknown; name?: unknown };
    types?: TypeLike[];
    target?: TypeLike;
    getBaseTypes?: () => TypeLike[];
};

type ParserServices = {
    esTreeNodeToTSNodeMap?: { get?: (node: Rule.Node) => unknown };
    getTypeAtLocation?: (node: Rule.Node) => TypeLike;
    program?: {
        getTypeChecker?: () => {
            getTypeAtLocation?: (node: unknown) => TypeLike;
        };
    };
};

type DomBinding = {
    id: AnyNode | null;
    init: AnyNode | null;
};

const DOM_TYPE_PATTERN = /^(?:Element|HTMLElement|SVGElement|MathMLElement|HTML[A-Z]\w*Element|SVG[A-Z]\w*Element)$/;
const DOM_TYPE_NODE_NAMES = new Set(['Element', 'HTMLElement', 'MathMLElement', 'SVGElement']);
const NULLISH_TYPE_NODE_NAMES = new Set(['TSNullKeyword', 'TSUndefinedKeyword', 'TSVoidKeyword']);
const DOM_RETURNING_METHODS = new Set([
    'closest',
    'createElement',
    'createElementNS',
    'elementFromPoint',
    'elementsFromPoint',
    'getElementById',
    'querySelector',
]);
const DOM_RETURNING_PROPERTIES = new Set([
    'activeElement',
    'firstElementChild',
    'lastElementChild',
    'nextElementSibling',
    'parentElement',
    'previousElementSibling',
]);

const asNode = (value: unknown): AnyNode | null => {
    if (value && typeof value === 'object' && 'type' in value) {
        return value as AnyNode;
    }

    return null;
};

const toNodeArray = (value: unknown): AnyNode[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map(item => asNode(item)).filter((node): node is AnyNode => node !== null);
};

const unwrapExpression = (rawNode: AnyNode | null | undefined): AnyNode | null => {
    let node = rawNode;

    while (node) {
        if (
            node.type === 'ChainExpression' ||
            node.type === 'ParenthesizedExpression' ||
            node.type === 'TSNonNullExpression'
        ) {
            node = asNode(node.expression);
            continue;
        }

        break;
    }

    return node ?? null;
};

const getBindingIdentifier = (rawNode: AnyNode | null | undefined): DomBinding => {
    const node = asNode(rawNode);

    if (!node) {
        return { id: null, init: null };
    }

    if (node.type === 'Identifier') {
        return { id: node, init: null };
    }

    if (node.type === 'AssignmentPattern') {
        return {
            id: getBindingIdentifier(asNode(node.left)).id,
            init: asNode(node.right),
        };
    }

    return { id: null, init: null };
};

const getTypeName = (typeNode: AnyNode | null | undefined): string | null => {
    const node = typeNode;

    if (!node) {
        return null;
    }

    if (node.type === 'Identifier') {
        return typeof node.name === 'string' ? node.name : null;
    }

    return null;
};

const isDomTypeName = (name: string | null | undefined) => Boolean(name && DOM_TYPE_PATTERN.test(name));

const isNullishTypeNode = (node: AnyNode | null) => Boolean(node && NULLISH_TYPE_NODE_NAMES.has(node.type));

const isDomTypeNode = (rawNode: AnyNode | null | undefined): boolean => {
    const node = rawNode;

    if (!node) {
        return false;
    }

    if (node.type === 'TSTypeReference') {
        const name = getTypeName(asNode(node.typeName));

        return Boolean(name && (isDomTypeName(name) || DOM_TYPE_NODE_NAMES.has(name)));
    }

    if (node.type === 'TSUnionType') {
        const types = toNodeArray(node.types);

        return (
            types.length > 0 &&
            types.some(typeNode => isDomTypeNode(typeNode)) &&
            types.every(typeNode => {
                return isDomTypeNode(typeNode) || isNullishTypeNode(typeNode);
            })
        );
    }

    if (node.type === 'TSIntersectionType') {
        return toNodeArray(node.types).some(typeNode => isDomTypeNode(typeNode));
    }

    if (node.type === 'TSParenthesizedType') {
        return isDomTypeNode(asNode(node.typeAnnotation));
    }

    return false;
};

const getMemberPropertyName = (rawNode: AnyNode | null | undefined): string | null => {
    const node = asNode(rawNode);

    if (!node) {
        return null;
    }

    if (node.type === 'Identifier') {
        return typeof node.name === 'string' ? node.name : null;
    }

    if (node.type === 'Literal' && typeof node.value === 'string') {
        return node.value;
    }

    return null;
};

const isDomExpression = (rawNode: AnyNode | null | undefined): boolean => {
    const node = unwrapExpression(rawNode);

    if (!node) {
        return false;
    }

    if (node.type === 'TSAsExpression' || node.type === 'TSTypeAssertion') {
        return isDomTypeNode(asNode(node.typeAnnotation)) || isDomExpression(asNode(node.expression));
    }

    if (node.type === 'CallExpression') {
        const callee = unwrapExpression(asNode(node.callee));

        if (!callee || callee.type !== 'MemberExpression') {
            return false;
        }

        const methodName = getMemberPropertyName(asNode(callee.property));

        return Boolean(methodName && DOM_RETURNING_METHODS.has(methodName));
    }

    if (node.type === 'MemberExpression') {
        const propertyName = getMemberPropertyName(asNode(node.property));

        return Boolean(propertyName && DOM_RETURNING_PROPERTIES.has(propertyName));
    }

    return false;
};

const getTypeNameFromType = (type: TypeLike): string | null => {
    const name =
        type.aliasSymbol?.escapedName ??
        type.aliasSymbol?.name ??
        type.symbol?.escapedName ??
        type.symbol?.name ??
        null;

    return typeof name === 'string' ? name : null;
};

const isDomType = (type: TypeLike | null | undefined, visited = new WeakSet<object>()): boolean => {
    if (!type || visited.has(type)) {
        return false;
    }

    visited.add(type);

    if (isDomTypeName(getTypeNameFromType(type))) {
        return true;
    }

    if (type.types?.some(item => isDomType(item, visited))) {
        return true;
    }

    if (type.target && isDomType(type.target, visited)) {
        return true;
    }

    return type.getBaseTypes?.().some(item => isDomType(item, visited)) ?? false;
};

const getTypeAtLocation = (services: ParserServices, node: Rule.Node): TypeLike | null => {
    if (typeof services.getTypeAtLocation === 'function') {
        return services.getTypeAtLocation(node);
    }

    const tsNode = services.esTreeNodeToTSNodeMap?.get?.(node);
    const typeChecker = services.program?.getTypeChecker?.();

    return tsNode && typeof typeChecker?.getTypeAtLocation === 'function'
        ? typeChecker.getTypeAtLocation(tsNode)
        : null;
};

const domNaming: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'enforce $ prefix for local DOM variables',
        },
        schema: [],
        messages: {
            missingDomPrefix: 'DOM variable `{{name}}` should start with `$`.',
        },
    },
    create(context) {
        const parserServices = context.sourceCode.parserServices as ParserServices;

        const isDomBinding = (id: AnyNode, init: AnyNode | null) => {
            if (isDomTypeNode(getTypeAnnotation(id)) || isDomExpression(init)) {
                return true;
            }

            const typedNode = id as unknown as Rule.Node;
            const type = getTypeAtLocation(parserServices, typedNode);

            return isDomType(type);
        };

        const checkDomBinding = (id: AnyNode | null, init: AnyNode | null) => {
            const name = getStaticName(id);

            if (!id || !name || name.startsWith('$')) {
                return;
            }

            if (!isDomBinding(id, init)) {
                return;
            }

            context.report({
                node: id as unknown as Rule.Node,
                messageId: 'missingDomPrefix',
                data: { name },
            });
        };

        const checkFunctionParameters = (node: AnyNode) => {
            for (const param of toNodeArray(node.params)) {
                const binding = getBindingIdentifier(param);

                checkDomBinding(binding.id, binding.init);
            }
        };

        return {
            VariableDeclarator(node: AnyNode) {
                const id = asNode(node.id);

                checkDomBinding(id, asNode(node.init));
            },
            FunctionDeclaration: checkFunctionParameters,
            FunctionExpression: checkFunctionParameters,
            ArrowFunctionExpression: checkFunctionParameters,
        } as unknown as Rule.RuleListener;
    },
};

export default domNaming;
