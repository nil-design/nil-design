import { isArray, isPlainObject, merge, UnionToIntersection } from '@nild/shared';
import type {
    UnknownContext,
    FallbackLanguages,
    Language,
    Locale,
    LocaleWriteMode,
    SerializedLocales,
    TranslationContext,
} from './interfaces';

const KEY_CACHE_LIMIT = 1000;

interface LocaleCache {
    rawLocale: Locale;
    flatLocale: Map<string, string>;
}

export interface ResolvePayload<Context extends UnknownContext = UnknownContext> {
    key: string;
    resolvedKey: string;
    namespace: string;
    languageChain: Language[];
    context: TranslationContext<Context>;
    language?: Language;
    result?: string;
}

export interface Plugin<Context extends UnknownContext = UnknownContext> {
    name: string;
    transform?(text: string, context: TranslationContext<Context>): string;
    beforeResolve?(payload: ResolvePayload<Context>): void;
    afterResolve?(payload: ResolvePayload<Context>): void;
    onMiss?(payload: ResolvePayload<Context>): void;
}

export type PluginFactory<Options = void, Context extends UnknownContext = UnknownContext> = (
    options?: Options,
) => Plugin<Context>;

export interface I18nOptions<Plugins extends readonly Plugin[] = readonly Plugin[]> {
    language?: Language;
    fallbackLanguages?: FallbackLanguages;
    namespace?: string;
    defaultNamespace?: string;
    namespaceDelimiter?: string;
    keyDelimiter?: string;
    locales?: SerializedLocales;
    localeWriteMode?: LocaleWriteMode;
    plugins?: Plugins;
    strict?: boolean;
}

// Strict key inference — derives valid keys and namespaces from locales for t() overloads.

type StrictOnly<Options extends I18nOptions, StrictType, LooseType = string> = Options['strict'] extends true
    ? StrictType
    : LooseType;

type LocalesConfig<Options extends I18nOptions> = NonNullable<Options['locales']>;
type NsLocaleMap<Options extends I18nOptions> = LocalesConfig<Options>[Extract<keyof LocalesConfig<Options>, string>];
type NamespaceName<Options extends I18nOptions> = Extract<keyof NsLocaleMap<Options>, string>;

type LocalePath<T> = T extends Locale
    ? {
          [Key in Extract<keyof T, string>]: T[Key] extends string
              ? Key
              : T[Key] extends Locale
                ? `${Key}.${LocalePath<T[Key]>}`
                : never;
      }[Extract<keyof T, string>]
    : never;

type KeyOfNamespace<Options extends I18nOptions, Namespace extends string> = LocalePath<
    Namespace extends NamespaceName<Options> ? NsLocaleMap<Options>[Namespace] : never
>;

type NamespacedKey<Options extends I18nOptions> = {
    [Namespace in NamespaceName<Options>]: `${Namespace}:${KeyOfNamespace<Options, Namespace>}`;
}[NamespaceName<Options>];

type DefaultNamespace<Options extends I18nOptions> = Options['defaultNamespace'] extends string
    ? Options['defaultNamespace']
    : '__default';

type DeclaredNamespace<Options extends I18nOptions> =
    | NamespaceName<Options>
    | Extract<Options['defaultNamespace'], string>;

type StringFallback<Value extends string> = [Value] extends [never] ? string : Value;

type NamespacedKeyArg<Options extends I18nOptions> = StringFallback<NamespacedKey<Options>>;
type BareKeyArg<Options extends I18nOptions, Namespace extends string> = StringFallback<
    KeyOfNamespace<Options, Namespace>
>;
type DefaultBareKeyArg<Options extends I18nOptions> = BareKeyArg<Options, DefaultNamespace<Options>>;
type NamespaceArg<Options extends I18nOptions> = StringFallback<DeclaredNamespace<Options>>;

// Plugin context — merges plugin extensions and resolves the t() call context type.

type InferExtensionContext<Plugins extends readonly Plugin[] | undefined> = Plugins extends readonly Plugin[]
    ? [Plugins[number]] extends [never]
        ? UnknownContext
        : UnionToIntersection<Plugins[number] extends Plugin<infer Context> ? Context : never>
    : UnknownContext;

type ExtensionContext<Options extends I18nOptions> = InferExtensionContext<Options['plugins']>;
type LooseTranslationContext<Options extends I18nOptions> = TranslationContext<ExtensionContext<Options>>;
type StrictTranslationContext<Options extends I18nOptions> = Omit<LooseTranslationContext<Options>, 'namespace'> & {
    namespace?: NamespaceArg<Options>;
};
type TranslateCallContext<Options extends I18nOptions> = StrictOnly<
    Options,
    StrictTranslationContext<Options>,
    LooseTranslationContext<Options>
>;

class I18n<const Options extends I18nOptions = I18nOptions> {
    private language?: Language;
    private fallbackLanguages: FallbackLanguages = [];
    private namespace?: string;
    private namespaceDelimiter: string;
    private defaultNamespace: string;
    private keyDelimiter: string;
    private localeWriteMode: LocaleWriteMode;
    private locales: Map<Language, Map<string, LocaleCache>>;
    private plugins: Plugin<ExtensionContext<Options>>[];
    private parsedKeyCache: Map<string, { namespace?: string; resolvedKey: string }>;
    private languageChainCache: Map<string, Language[]>;

    constructor({
        language,
        fallbackLanguages = [],
        namespace,
        namespaceDelimiter = ':',
        keyDelimiter = '.',
        defaultNamespace,
        locales: serializedLocales = {},
        localeWriteMode = 'merge',
        plugins = [] as Options['plugins'],
    }: Options) {
        this.parsedKeyCache = new Map();
        this.languageChainCache = new Map();
        this.namespaceDelimiter = namespaceDelimiter;
        this.keyDelimiter = keyDelimiter;
        this.defaultNamespace = defaultNamespace ?? '__default';
        this.localeWriteMode = localeWriteMode;
        this.locales = new Map();
        this.plugins = [];
        this.setLanguage(language);
        this.setNamespace(namespace);
        this.setFallbackLanguages(fallbackLanguages);

        for (const [lang, maybeLocale] of Object.entries(serializedLocales) as [Language, Record<string, Locale>][]) {
            for (const [ns, locale] of Object.entries(maybeLocale)) {
                if (!isPlainObject(locale)) continue;

                this.writeLocale(lang, ns, locale as Locale, localeWriteMode);
            }
        }

        const registeredPlugins = new Set<string>();

        for (const plugin of plugins as readonly Plugin<ExtensionContext<Options>>[]) {
            if (registeredPlugins.has(plugin.name)) continue;

            registeredPlugins.add(plugin.name);
            this.plugins.push(plugin);
        }
    }

    /**
     * Flattens nested locale objects into a delimiter-joined key index for fast text lookup.
     */
    private createFlatLocale(locale: Locale): Map<string, string> {
        const flatLocale = new Map<string, string>();

        const walkLocale = (currentLocale: Locale, prefix = '') => {
            for (const [key, value] of Object.entries(currentLocale)) {
                const nextPath = prefix ? `${prefix}${this.keyDelimiter}${key}` : key;
                if (typeof value === 'string') {
                    flatLocale.set(nextPath, value);
                    continue;
                }

                if (isPlainObject(value)) {
                    walkLocale(value as Locale, nextPath);
                }
            }
        };

        walkLocale(locale);
        /**
         * Keep current behavior: literal keys on the root locale object win over nested traversal.
         */
        for (const [key, value] of Object.entries(locale)) {
            if (typeof value === 'string') {
                flatLocale.set(key, value);
            }
        }

        return flatLocale;
    }

    /**
     * Stores or merges a locale into the internal locale map and rebuilds the flat key index.
     */
    private writeLocale(language: Language, namespace: string, locale: Locale, writeMode = this.localeWriteMode) {
        if (!this.locales.has(language)) this.locales.set(language, new Map());
        const nsLocaleMap = this.locales.get(language)!;

        const current = nsLocaleMap.get(namespace);
        const replacing = writeMode === 'replace';
        const nextLocale = !current || replacing ? locale : (merge({}, current.rawLocale, locale) as Locale);

        nsLocaleMap.set(namespace, { rawLocale: nextLocale, flatLocale: this.createFlatLocale(nextLocale) });
    }

    /**
     * Parses a translation key and caches the namespace/resolved-key split for repeated lookups.
     */
    private parseKey(key: string): { namespace?: string; resolvedKey: string } {
        const cached = this.parsedKeyCache.get(key);
        if (cached) return cached;

        const delimiterIndex = key.indexOf(this.namespaceDelimiter);
        const namespace = delimiterIndex > -1 ? key.slice(0, delimiterIndex) : undefined;
        const resolvedKey = delimiterIndex > -1 ? key.slice(delimiterIndex + this.namespaceDelimiter.length) : key;
        const parsed = { namespace, resolvedKey };

        this.parsedKeyCache.set(key, parsed);
        if (this.parsedKeyCache.size > KEY_CACHE_LIMIT) {
            const oldest = this.parsedKeyCache.keys().next();
            if (!oldest.done) this.parsedKeyCache.delete(oldest.value);
        }

        return parsed;
    }

    /**
     * Builds a deduplicated language lookup order: exact language, regional language, then configured fallbacks.
     */
    private createLanguageChain(anchorLanguage?: Language): Language[] {
        const languageChain: Language[] = [];
        const seen = new Set<Language>();

        const getFallbacks = (language?: Language): Language[] => {
            if (isArray(this.fallbackLanguages)) return this.fallbackLanguages;
            if (!language) return [];

            const regional = language.split('-')[0];

            return this.fallbackLanguages[language] ?? this.fallbackLanguages[regional] ?? [];
        };

        const appendLanguage = (language?: Language) => {
            if (!language || seen.has(language)) return;

            seen.add(language);
            languageChain.push(language);

            const regional = language.split('-')[0] as Language;
            if (regional !== language && !seen.has(regional)) {
                seen.add(regional);
                languageChain.push(regional);
            }
        };

        appendLanguage(anchorLanguage);
        for (const fallbackLanguage of getFallbacks(anchorLanguage)) {
            appendLanguage(fallbackLanguage);
        }

        return languageChain;
    }

    /**
     * Returns a language chain from cache or builds and caches a new one.
     */
    private resolveLanguageChain(anchorLanguage?: Language): Language[] {
        const cacheKey = anchorLanguage ?? '__contextual__';
        const cached = this.languageChainCache.get(cacheKey);
        if (cached) return cached;

        const languageChain = this.createLanguageChain(anchorLanguage);
        this.languageChainCache.set(cacheKey, languageChain);

        return languageChain;
    }

    /**
     * Scans the language chain and returns the first translation hit for the given namespace/resolved key.
     */
    private resolveEntry(
        namespace: string,
        resolvedKey: string,
        languageChain: Language[],
    ): { text: string; language: Language } | undefined {
        for (const language of languageChain) {
            const text = this.locales.get(language)?.get(namespace)?.flatLocale.get(resolvedKey);
            if (text !== undefined) return { text, language };
        }

        return undefined;
    }

    setLanguage(language?: Language) {
        this.language = language;
    }

    setNamespace(namespace?: string) {
        this.namespace = namespace;
    }

    setFallbackLanguages(fallbackLanguages: FallbackLanguages = []) {
        this.fallbackLanguages = fallbackLanguages;
        this.languageChainCache.clear();
    }

    addLocale(context: { language: Language; namespace?: string }, locale: Locale) {
        this.writeLocale(context.language, context.namespace ?? this.defaultNamespace, locale);
    }

    /**
     * Strict mode: explicit namespace in key always controls lookup namespace.
     */
    t(key: StrictOnly<Options, NamespacedKeyArg<Options>>, context?: TranslateCallContext<Options>): string;
    /**
     * Strict mode: bare key is constrained by provided context.namespace.
     */
    t<Namespace extends NamespaceArg<Options>>(
        key: StrictOnly<Options, BareKeyArg<Options, Namespace>>,
        context: TranslateCallContext<Options> & { namespace: Namespace },
    ): string;
    /**
     * Strict mode: bare key without namespace is constrained by runtime default namespace.
     */
    t(
        key: StrictOnly<Options, DefaultBareKeyArg<Options>>,
        context?: TranslateCallContext<Options> & { namespace?: undefined },
    ): string;
    t(key: string, context: TranslateCallContext<Options> = {} as TranslateCallContext<Options>) {
        const { language: targetLanguage, namespace: targetNamespace } = context as TranslationContext<UnknownContext>;
        const parsedKey = this.parseKey(key);
        const namespace = parsedKey.namespace ?? targetNamespace ?? this.namespace ?? this.defaultNamespace;
        const languageChain = this.resolveLanguageChain(targetLanguage ?? this.language);
        const resolvedContext = { ...context, namespace } as TranslationContext<ExtensionContext<Options>>;
        const payload: ResolvePayload<ExtensionContext<Options>> = {
            key,
            resolvedKey: parsedKey.resolvedKey,
            namespace,
            languageChain,
            context: resolvedContext,
        };

        for (const plugin of this.plugins) plugin.beforeResolve?.(payload);

        const resolvedEntry = this.resolveEntry(namespace, parsedKey.resolvedKey, languageChain);
        if (!resolvedEntry) {
            for (const plugin of this.plugins) plugin.onMiss?.(payload);
            for (const plugin of this.plugins) plugin.afterResolve?.(payload);

            return key;
        }

        const pluginContext = { ...resolvedContext, language: resolvedEntry.language };
        let result = resolvedEntry.text;
        for (const plugin of this.plugins) {
            if (plugin.transform) result = plugin.transform(result, pluginContext);
        }

        for (const plugin of this.plugins)
            plugin.afterResolve?.({ ...payload, language: resolvedEntry.language, result });

        return result;
    }
}

export default I18n;
