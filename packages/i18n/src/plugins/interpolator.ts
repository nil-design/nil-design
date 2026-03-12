import { escapeRegExp } from '@nild/shared';
import type { PluginCreator } from '../PluginManager';

interface InterpolatorOptions {
    openToken?: string;
    closeToken?: string;
}

const interpolator: PluginCreator<
    InterpolatorOptions,
    {
        parameters?: Record<string, unknown>;
    }
> = ({ openToken = '{{', closeToken = '}}' } = {}) => {
    const openPattern = escapeRegExp(openToken);
    const closePattern = escapeRegExp(closeToken);
    const tokenPattern = new RegExp(`${openPattern}\\s*([\\s\\S]+?)\\s*${closePattern}`, 'g');

    const readParameter = (parameters: Record<string, unknown>, token: string) => {
        if (token in parameters) {
            return parameters[token];
        }

        const tokenPath = token.split('.');
        let nextValue: unknown = parameters;

        for (const tokenKey of tokenPath) {
            const traversable = typeof nextValue === 'object' && nextValue !== null;
            if (!traversable || !(tokenKey in (nextValue as Record<string, unknown>))) {
                return undefined;
            }

            nextValue = (nextValue as Record<string, unknown>)[tokenKey];
        }

        return nextValue;
    };

    const interpolate = (text: string, parameters: Record<string, unknown>): string =>
        text.replace(tokenPattern, (placeholder, token: string) => {
            const trimmedToken = token.trim();
            const parameter = readParameter(parameters, trimmedToken);

            return parameter === undefined ? placeholder : String(parameter);
        });

    return {
        name: 'interpolator',
        apply(text: string, context): string {
            const { parameters = {} } = context;

            return interpolate(text, parameters);
        },
    };
};

export default interpolator;
