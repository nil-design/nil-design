import type { Rule, Scope, SourceCode } from 'eslint';

type AnyNode = {
    type: string;
    [key: string]: unknown;
};

const BOOLEAN_PREFIXES = Object.freeze([
    'is',
    'are',
    'has',
    'have',
    'can',
    'should',
    'need',
    'needs',
    'must',
    'will',
    'would',
    'could',
    'did',
    'does',
    'do',
    'was',
    'were',
]);

const BOOLEAN_PREFIX_PATTERN = new RegExp(`^(?:${BOOLEAN_PREFIXES.join('|')})(?=[A-Z0-9_])`);
const IDENTIFIER_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const BOOLEAN_BINARY_OPERATORS = new Set(['==', '===', '!=', '!==', '<', '<=', '>', '>=', 'in', 'instanceof']);
const FUNCTION_NODE_TYPES = new Set(['ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression']);

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
        if (node.type === 'ChainExpression' || node.type === 'TSAsExpression' || node.type === 'TSNonNullExpression') {
            node = asNode(node.expression);
            continue;
        }
        if (node.type === 'TSTypeAssertion' || node.type === 'ParenthesizedExpression') {
            node = asNode(node.expression);
            continue;
        }

        break;
    }

    return node ?? null;
};

const unwrapTypeNode = (rawNode: AnyNode | null | undefined): AnyNode | null => {
    let node = rawNode;

    while (node?.type === 'TSParenthesizedType') {
        node = asNode(node.typeAnnotation);
    }

    return node ?? null;
};

const getLiteralValue = (node: AnyNode | null | undefined): string | null => {
    if (!node) {
        return null;
    }

    if (node.type === 'Literal' && typeof node.value === 'string') {
        return node.value;
    }

    if (node.type === 'TemplateLiteral' && Array.isArray(node.expressions) && node.expressions.length === 0) {
        const [quasi] = (node.quasis as Array<{ value?: { cooked?: string | null } }> | undefined) ?? [];

        return quasi?.value?.cooked ?? null;
    }

    return null;
};

const getStaticName = (rawNode: AnyNode | null | undefined): string | null => {
    const node = asNode(rawNode);

    if (!node) {
        return null;
    }

    if (node.type === 'Identifier' || node.type === 'PrivateIdentifier') {
        return typeof node.name === 'string' ? node.name : null;
    }

    const literalValue = getLiteralValue(node);

    if (literalValue && IDENTIFIER_PATTERN.test(literalValue)) {
        return literalValue;
    }

    return null;
};

const getTypeAnnotation = (node: AnyNode | null | undefined): AnyNode | null => {
    const typeAnnotation = asNode(node?.typeAnnotation);

    return asNode(typeAnnotation?.typeAnnotation);
};

const isBooleanLiteralNode = (rawNode: AnyNode | null | undefined): boolean => {
    const node = unwrapExpression(rawNode);

    return node?.type === 'Literal' && typeof node.value === 'boolean';
};

const isBooleanTypeNode = (rawNode: AnyNode | null | undefined): boolean => {
    const node = unwrapTypeNode(rawNode);

    if (!node) {
        return false;
    }

    if (node.type === 'TSBooleanKeyword' || node.type === 'TSTypePredicate') {
        return true;
    }

    if (node.type === 'TSLiteralType') {
        return isBooleanLiteralNode(asNode(node.literal));
    }

    if (node.type === 'TSUnionType') {
        const typeNodes = toNodeArray(node.types);

        return typeNodes.length > 0 && typeNodes.every(typeNode => isBooleanTypeNode(typeNode));
    }

    return false;
};

const isBooleanFunctionTypeNode = (rawNode: AnyNode | null | undefined): boolean => {
    const node = unwrapTypeNode(rawNode);

    if (!node) {
        return false;
    }

    if (node.type === 'TSFunctionType') {
        const returnType = asNode(node.returnType);

        return isBooleanTypeNode(asNode(returnType?.typeAnnotation));
    }

    return false;
};

const hasBooleanPrefix = (name: string): boolean => {
    return BOOLEAN_PREFIX_PATTERN.test(name);
};

const findVariable = (sourceCode: SourceCode, node: AnyNode, name: string): Scope.Variable | null => {
    let scope: Scope.Scope | null = sourceCode.getScope(node as unknown as Rule.Node);

    while (scope) {
        const variable = scope.set.get(name);

        if (variable) {
            return variable;
        }

        scope = scope.upper;
    }

    return null;
};

const isBooleanFunctionLikeNode = (
    sourceCode: SourceCode,
    rawNode: AnyNode | null | undefined,
    visitedVariables = new Set<Scope.Variable>(),
    visitedNodes = new WeakSet<object>(),
): boolean => {
    const node = asNode(rawNode);

    if (!node || visitedNodes.has(node)) {
        return false;
    }

    visitedNodes.add(node);

    if (node.type === 'Identifier' && typeof node.name === 'string') {
        const variable = findVariable(sourceCode, node, node.name);

        if (!variable || visitedVariables.has(variable)) {
            return false;
        }

        visitedVariables.add(variable);

        if (variable.identifiers.some(identifier => isBooleanFunctionTypeNode(getTypeAnnotation(asNode(identifier))))) {
            return true;
        }

        return variable.defs.some(definition => {
            if (definition.type === 'FunctionName') {
                return isBooleanFunctionLikeNode(sourceCode, asNode(definition.node), visitedVariables, visitedNodes);
            }

            if (definition.type !== 'Variable') {
                return false;
            }

            const declarator = asNode(definition.node);

            if (isBooleanFunctionTypeNode(getTypeAnnotation(asNode(declarator?.id)))) {
                return true;
            }

            return isBooleanFunctionLikeNode(sourceCode, asNode(declarator?.init), visitedVariables, visitedNodes);
        });
    }

    if (isBooleanTypeNode(asNode(asNode(node.returnType)?.typeAnnotation))) {
        return true;
    }

    const typeAnnotation = getTypeAnnotation(node);

    if (isBooleanFunctionTypeNode(typeAnnotation)) {
        return true;
    }

    if (node.type === 'ArrowFunctionExpression' && node.expression === true) {
        return isBooleanExpression(sourceCode, asNode(node.body), visitedVariables, visitedNodes);
    }

    const body = asNode(node.body);

    if (!body || body.type !== 'BlockStatement') {
        return false;
    }

    const returnArguments: Array<AnyNode | null> = [];
    const stack = [...toNodeArray(body.body)];

    while (stack.length > 0) {
        const current = stack.pop();

        if (!current) {
            continue;
        }

        if (current.type === 'ReturnStatement') {
            returnArguments.push(asNode(current.argument));
            continue;
        }

        if (FUNCTION_NODE_TYPES.has(current.type)) {
            continue;
        }

        const visitorKeys = sourceCode.visitorKeys[current.type] ?? [];

        for (const visitorKey of visitorKeys) {
            const child = current[visitorKey];

            if (Array.isArray(child)) {
                for (let i = child.length - 1; i >= 0; i -= 1) {
                    const childNode = asNode(child[i]);

                    if (childNode) {
                        stack.push(childNode);
                    }
                }
            } else {
                const childNode = asNode(child);

                if (childNode) {
                    stack.push(childNode);
                }
            }
        }
    }

    return (
        returnArguments.length > 0 &&
        returnArguments.every(argument => isBooleanExpression(sourceCode, argument, visitedVariables, visitedNodes))
    );
};

const isBooleanVariable = (
    sourceCode: SourceCode,
    variable: Scope.Variable | null,
    visitedVariables = new Set<Scope.Variable>(),
    visitedNodes = new WeakSet<object>(),
): boolean => {
    if (!variable || visitedVariables.has(variable)) {
        return false;
    }

    visitedVariables.add(variable);

    if (
        variable.identifiers.some(identifier => {
            const identifierNode = asNode(identifier);

            return isBooleanTypeNode(getTypeAnnotation(identifierNode));
        })
    ) {
        return true;
    }

    return variable.defs.some(definition => {
        if (definition.type !== 'Variable') {
            return false;
        }

        const declarator = asNode(definition.node);

        if (isBooleanTypeNode(getTypeAnnotation(asNode(declarator?.id)))) {
            return true;
        }

        return isBooleanExpression(sourceCode, asNode(declarator?.init), visitedVariables, visitedNodes);
    });
};

const isBooleanCallExpression = (
    sourceCode: SourceCode,
    rawNode: AnyNode,
    visitedVariables = new Set<Scope.Variable>(),
    visitedNodes = new WeakSet<object>(),
): boolean => {
    const node = unwrapExpression(rawNode);

    if (!node || node.type !== 'CallExpression') {
        return false;
    }

    const callee = unwrapExpression(asNode(node.callee));

    if (!callee) {
        return false;
    }

    if (callee.type === 'Identifier') {
        if (typeof callee.name === 'string' && (callee.name === 'Boolean' || hasBooleanPrefix(callee.name))) {
            return true;
        }

        if (typeof callee.name !== 'string') {
            return false;
        }

        const variable = findVariable(sourceCode, callee, callee.name);

        if (!variable) {
            return false;
        }

        return variable.defs.some(definition => {
            if (definition.type === 'FunctionName') {
                return isBooleanFunctionLikeNode(sourceCode, asNode(definition.node), visitedVariables, visitedNodes);
            }

            if (definition.type !== 'Variable') {
                return false;
            }

            const declarator = asNode(definition.node);

            if (isBooleanFunctionTypeNode(getTypeAnnotation(asNode(declarator?.id)))) {
                return true;
            }

            return isBooleanFunctionLikeNode(sourceCode, asNode(declarator?.init), visitedVariables, visitedNodes);
        });
    }

    if (callee.type === 'MemberExpression') {
        const propertyName = getStaticName(asNode(callee.property));

        return Boolean(propertyName && hasBooleanPrefix(propertyName));
    }

    return false;
};

const isBooleanExpression = (
    sourceCode: SourceCode,
    rawNode: AnyNode | null | undefined,
    visitedVariables = new Set<Scope.Variable>(),
    visitedNodes = new WeakSet<object>(),
): boolean => {
    const node = unwrapExpression(rawNode);

    if (!node || visitedNodes.has(node)) {
        return false;
    }

    visitedNodes.add(node);

    if (isBooleanLiteralNode(node)) {
        return true;
    }

    if (node.type === 'UnaryExpression') {
        return (
            node.operator === '!' &&
            isBooleanExpression(sourceCode, asNode(node.argument), visitedVariables, visitedNodes)
        );
    }

    if (node.type === 'BinaryExpression') {
        return typeof node.operator === 'string' && BOOLEAN_BINARY_OPERATORS.has(node.operator);
    }

    if (node.type === 'LogicalExpression') {
        return (
            isBooleanExpression(sourceCode, asNode(node.left), visitedVariables, visitedNodes) &&
            isBooleanExpression(sourceCode, asNode(node.right), visitedVariables, visitedNodes)
        );
    }

    if (node.type === 'ConditionalExpression') {
        return (
            isBooleanExpression(sourceCode, asNode(node.consequent), visitedVariables, visitedNodes) &&
            isBooleanExpression(sourceCode, asNode(node.alternate), visitedVariables, visitedNodes)
        );
    }

    if (node.type === 'SequenceExpression') {
        const expressions = toNodeArray(node.expressions);

        return isBooleanExpression(sourceCode, expressions.at(-1) ?? null, visitedVariables, visitedNodes);
    }

    if (node.type === 'Identifier') {
        if (typeof node.name !== 'string') {
            return false;
        }

        const variable = findVariable(sourceCode, node, node.name);

        return isBooleanVariable(sourceCode, variable, visitedVariables, visitedNodes);
    }

    if (node.type === 'MemberExpression') {
        const propertyName = getStaticName(asNode(node.property));

        return Boolean(propertyName && hasBooleanPrefix(propertyName));
    }

    if (node.type === 'CallExpression') {
        return isBooleanCallExpression(sourceCode, node, visitedVariables, visitedNodes);
    }

    return false;
};

export {
    getStaticName,
    getTypeAnnotation,
    hasBooleanPrefix,
    isBooleanExpression,
    isBooleanFunctionLikeNode,
    isBooleanFunctionTypeNode,
    isBooleanTypeNode,
};
