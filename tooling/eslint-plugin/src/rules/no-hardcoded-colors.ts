import { getStringValue, isHardcodedColorLiteral } from './_shared/color';
import type { Rule } from 'eslint';

type AnyNode = {
    type: string;
    [key: string]: unknown;
};

const noHardcodedColors: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow hardcoded colors in logical files',
        },
        schema: [],
        messages: {
            unexpectedColor:
                'Hardcoded color literal `{{value}}` is not allowed in logical files. Use a design token, CSS variable, or semantic color instead.',
        },
    },
    create(context) {
        const parserServices = context.sourceCode.parserServices as {
            defineTemplateBodyVisitor?: (
                templateBodyVisitor: Rule.RuleListener,
                scriptVisitor?: Rule.RuleListener,
            ) => Rule.RuleListener;
        };

        const reportIfNeeded = (node: AnyNode | null | undefined) => {
            const value = getStringValue(node);

            if (!value || !isHardcodedColorLiteral(value)) {
                return;
            }

            context.report({
                node: node as unknown as Rule.Node,
                messageId: 'unexpectedColor',
                data: { value: value.trim() },
            });
        };

        const sharedVisitors = {
            Literal(node: AnyNode) {
                reportIfNeeded(node);
            },
            TemplateLiteral(node: AnyNode) {
                reportIfNeeded(node);
            },
        };

        const scriptVisitors = { ...sharedVisitors };

        if (typeof parserServices.defineTemplateBodyVisitor === 'function') {
            return parserServices.defineTemplateBodyVisitor(
                {
                    ...sharedVisitors,
                    VLiteral(node: AnyNode) {
                        reportIfNeeded(node);
                    },
                } as unknown as Rule.RuleListener,
                scriptVisitors as unknown as Rule.RuleListener,
            );
        }

        return scriptVisitors as unknown as Rule.RuleListener;
    },
};

export default noHardcodedColors;
