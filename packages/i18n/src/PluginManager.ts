import { UnionToIntersection } from '@nild/shared';
import type { Context, Language, UnknownContext } from './_shared/interfaces';

export interface ResolvePayload<T extends UnknownContext = UnknownContext> {
    key: string;
    resolvedKey: string;
    namespace: string;
    languageTrail: Language[];
    context: Context<T>;
}

export interface ResolveResultPayload<T extends UnknownContext = UnknownContext> extends ResolvePayload<T> {
    language?: Language;
    result?: string;
}

export interface Plugin<T extends UnknownContext = UnknownContext> {
    name: string;
    apply?(text: string, context: Context<T>): string;
    resolving?(payload: ResolvePayload<T>): void;
    resolved?(payload: ResolveResultPayload<T>): void;
    missing?(payload: ResolvePayload<T>): void;
}

export type PluginCreator<O, T extends UnknownContext = UnknownContext> = (options: O) => Plugin<T>;

export interface PluginManagerOptions<Plugins extends readonly Plugin[] = readonly Plugin[]> {
    plugins?: Plugins;
}

type UnwrapPlugin<T> = T extends Plugin<infer U> ? U : never;

export type PluginContext<Options extends PluginManagerOptions> =
    Options extends PluginManagerOptions<infer Plugins>
        ? UnionToIntersection<UnwrapPlugin<Plugins[number]>>
        : UnknownContext;

class PluginManager<
    Options extends PluginManagerOptions = PluginManagerOptions,
    U extends UnknownContext = PluginContext<Options>,
> {
    private plugins: Map<string, Plugin<U>>;

    constructor(options: Options = {} as Options) {
        this.plugins = new Map();

        const { plugins = [] } = options;
        for (const plugin of plugins) {
            const duplicated = this.plugins.has(plugin.name);
            if (!duplicated) {
                this.plugins.set(plugin.name, plugin);
            }
        }
    }

    resolving(payload: ResolvePayload<U>) {
        for (const [, plugin] of this.plugins) {
            plugin.resolving?.(payload);
        }
    }

    resolved(payload: ResolveResultPayload<U>) {
        for (const [, plugin] of this.plugins) {
            plugin.resolved?.(payload);
        }
    }

    missing(payload: ResolvePayload<U>) {
        for (const [, plugin] of this.plugins) {
            plugin.missing?.(payload);
        }
    }

    apply(text: string, context: Context<U>) {
        let nextText = text;
        for (const [, plugin] of this.plugins) {
            if (plugin.apply) {
                nextText = plugin.apply(nextText, context);
            }
        }

        return nextText;
    }
}

export default PluginManager;
