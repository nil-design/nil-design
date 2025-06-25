import { UnionToIntersection } from '@nild/shared';
import type { UnknownContext, Context } from './_shared/interfaces';

export interface Plugin<T extends UnknownContext = UnknownContext> {
    name: string;
    apply(text: string, context: Context<T>): string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginCreator<T extends UnknownContext = UnknownContext> = (...args: any[]) => Plugin<T>;

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
            if (!this.plugins.has(plugin.name)) {
                this.plugins.set(plugin.name, plugin);
            }
        }
    }

    apply(result: string, context: Context<U>) {
        let nextResult = result;
        for (const [, plugin] of this.plugins) {
            nextResult = plugin.apply(nextResult, context);
        }

        return nextResult;
    }
}

export default PluginManager;
