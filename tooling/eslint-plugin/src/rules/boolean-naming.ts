import {
    getStaticName,
    getTypeAnnotation,
    hasBooleanPrefix,
    isBooleanExpression,
    isBooleanFunctionLikeNode,
    isBooleanFunctionTypeNode,
    isBooleanTypeNode,
} from './_shared/boolean';
import type { Rule } from 'eslint';

type AnyNode = {
    type: string;
    [key: string]: unknown;
};

const booleanNaming: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'enforce boolean naming conventions for data and boolean-returning callables',
        },
        schema: [],
        messages: {
            missingFunctionPrefix:
                'Boolean-returning callable `{{name}}` should use a boolean prefix such as `is`, `has`, `can`, or `are`.',
            unexpectedDataPrefix: 'Boolean data `{{name}}` should describe a state instead of using a boolean prefix.',
        },
    },
    create(context) {
        const sourceCode = context.sourceCode;

        const reportDataName = (node: AnyNode, name: string) => {
            if (hasBooleanPrefix(name)) {
                context.report({
                    node: node as unknown as Rule.Node,
                    messageId: 'unexpectedDataPrefix',
                    data: { name },
                });

                return;
            }
        };

        const reportCallableName = (node: AnyNode, name: string) => {
            if (!hasBooleanPrefix(name)) {
                context.report({
                    node: node as unknown as Rule.Node,
                    messageId: 'missingFunctionPrefix',
                    data: { name },
                });
            }
        };

        const listeners: Record<string, (node: AnyNode) => void> = {
            FunctionDeclaration: node => {
                const name = getStaticName(node.id as AnyNode | null);

                if (!name) {
                    return;
                }

                if (isBooleanFunctionLikeNode(sourceCode, node)) {
                    reportCallableName((node.id as AnyNode) ?? node, name);
                }
            },
            MethodDefinition: node => {
                if (node.kind === 'constructor' || node.kind === 'set') {
                    return;
                }

                const name = getStaticName(node.key as AnyNode | null);

                if (!name) {
                    return;
                }

                if (!isBooleanFunctionLikeNode(sourceCode, node.value as AnyNode | null)) {
                    return;
                }

                if (node.kind === 'get') {
                    reportDataName((node.key as AnyNode) ?? node, name);

                    return;
                }

                reportCallableName((node.key as AnyNode) ?? node, name);
            },
            Property: node => {
                if (node.computed === true || node.kind === 'set') {
                    return;
                }

                const name = getStaticName(node.key as AnyNode | null);

                if (!name) {
                    return;
                }

                if (node.kind === 'get') {
                    if (isBooleanFunctionLikeNode(sourceCode, node.value as AnyNode | null)) {
                        reportDataName((node.key as AnyNode) ?? node, name);
                    }

                    return;
                }

                if (isBooleanFunctionLikeNode(sourceCode, node.value as AnyNode | null)) {
                    reportCallableName((node.key as AnyNode) ?? node, name);

                    return;
                }

                if (isBooleanExpression(sourceCode, node.value as AnyNode | null)) {
                    reportDataName((node.key as AnyNode) ?? node, name);
                }
            },
            PropertyDefinition: node => {
                const name = getStaticName((node.key as AnyNode | null) ?? null);

                if (!name) {
                    return;
                }

                const typeAnnotation = getTypeAnnotation(node);

                if (
                    isBooleanFunctionTypeNode(typeAnnotation) ||
                    isBooleanFunctionLikeNode(sourceCode, node.value as AnyNode | null)
                ) {
                    reportCallableName((node.key as AnyNode) ?? node, name);

                    return;
                }

                if (
                    isBooleanTypeNode(typeAnnotation) ||
                    isBooleanExpression(sourceCode, node.value as AnyNode | null)
                ) {
                    reportDataName((node.key as AnyNode) ?? node, name);
                }
            },
            TSMethodSignature: node => {
                const name = getStaticName(node.key as AnyNode | null);

                if (!name) {
                    return;
                }

                if (isBooleanTypeNode((node.returnType as AnyNode | null)?.typeAnnotation as AnyNode | null)) {
                    reportCallableName((node.key as AnyNode) ?? node, name);
                }
            },
            TSPropertySignature: node => {
                if (node.computed === true) {
                    return;
                }

                const name = getStaticName(node.key as AnyNode | null);

                if (!name) {
                    return;
                }

                const typeAnnotation = getTypeAnnotation(node);

                if (isBooleanFunctionTypeNode(typeAnnotation)) {
                    reportCallableName((node.key as AnyNode) ?? node, name);

                    return;
                }

                if (isBooleanTypeNode(typeAnnotation)) {
                    reportDataName((node.key as AnyNode) ?? node, name);
                }
            },
            VariableDeclarator: node => {
                const name = getStaticName(node.id as AnyNode | null);

                if (!name) {
                    return;
                }

                const typeAnnotation = getTypeAnnotation(node.id as AnyNode | null);

                if (
                    isBooleanFunctionTypeNode(typeAnnotation) ||
                    isBooleanFunctionLikeNode(sourceCode, node.init as AnyNode | null)
                ) {
                    reportCallableName((node.id as AnyNode) ?? node, name);

                    return;
                }

                if (isBooleanTypeNode(typeAnnotation) || isBooleanExpression(sourceCode, node.init as AnyNode | null)) {
                    reportDataName((node.id as AnyNode) ?? node, name);
                }
            },
        };

        return listeners as unknown as Rule.RuleListener;
    },
};

export default booleanNaming;
