import type { PluginCreator } from '../PluginManger';

interface InterpolatorOptions {
    openToken?: string;
    closeToken?: string;
}

const interpolator: PluginCreator<{
    parameters?: Record<string, unknown>;
}> = ({ openToken = '{{', closeToken = '}}' }: InterpolatorOptions = {}) => {
    const interpolate = (text: string, parameters: Record<string, unknown>): string => {
        const tokens: string[] = [];
        const stack: number[] = [];
        let i = 0,
            j = 0;

        while (i < text.length) {
            if (text.slice(i, i + openToken.length) === openToken) {
                stack.push(i + openToken.length);
                i += openToken.length;
            } else if (text.slice(i, i + closeToken.length) === closeToken) {
                if (stack.length > 0) {
                    const start = stack.pop()!;
                    if (stack.length === 0) {
                        tokens.push(text.slice(j, start - openToken.length));
                        const placeholder = text.slice(start, i);
                        const key = placeholder.trim();
                        if (key in parameters) {
                            tokens.push(String(parameters[key]));
                        } else {
                            tokens.push(`${openToken}${placeholder}${closeToken}`);
                        }
                    }
                }
                i += closeToken.length;
                j = i;
            } else {
                i++;
            }
        }

        tokens.push(text.slice(j));

        return tokens.join('');
    };

    return {
        name: 'interpolator',
        apply(result: string, context): string {
            const { parameters = {} } = context;

            return interpolate(result, parameters);
        },
    };
};

export default interpolator;
