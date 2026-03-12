import { isArray } from '@nild/shared';
import { Locale, Context, Language, UnknownContext } from './_shared/interfaces';
import LocaleManager, { LocaleManagerOptions, SerializedLocales } from './LocaleManager';
import PluginManager, { Plugin, PluginManagerOptions, PluginContext, ResolvePayload } from './PluginManager';

const CACHE_LIMIT = 300;

type LanguageFallbacks = Language[] | Record<string, Language[]>;
type LocaleNamespaceEntry = { namespace: string; locale: Locale };
type LocaleBundleValue<Locales> = Locales extends object ? Locales[Extract<keyof Locales, string>] : never;
type NamespacedBundleEntry<Locales> =
    LocaleBundleValue<Locales> extends readonly (infer Entry)[]
        ? Entry extends LocaleNamespaceEntry
            ? Entry
            : never
        : never;
type FlatBundleLocale<Locales> = Extract<LocaleBundleValue<Locales>, Locale>;

type LocaleKey<T> = T extends Locale
    ? {
          [K in Extract<keyof T, string>]: T[K] extends string
              ? K
              : T[K] extends Locale
                ? `${K}.${LocaleKey<T[K]>}`
                : never;
      }[Extract<keyof T, string>]
    : never;

export interface I18nOptions<Plugins extends readonly Plugin[] = readonly Plugin[]>
    extends Omit<LocaleManagerOptions, 'locales'>,
        PluginManagerOptions<Plugins> {
    locales?: SerializedLocales;
    language?: Language;
    fallbackLanguages?: LanguageFallbacks;
    namespace?: string;
    namespaceDelimiter?: string;
    keyDelimiter?: string;
    strictKey?: boolean;
}

type LocalesFromOptions<Options extends I18nOptions> = NonNullable<Options['locales']>;
type BareLocaleKey<Options extends I18nOptions> = LocaleKey<
    FlatBundleLocale<LocalesFromOptions<Options>> | NamespacedBundleEntry<LocalesFromOptions<Options>>['locale']
>;
type NamespacedLocaleKey<Options extends I18nOptions> =
    NamespacedBundleEntry<LocalesFromOptions<Options>> extends infer Entry
        ? Entry extends LocaleNamespaceEntry
            ? `${Entry['namespace']}:${LocaleKey<Entry['locale']>}`
            : never
        : never;
type StrictLocaleKey<Options extends I18nOptions> = BareLocaleKey<Options> | NamespacedLocaleKey<Options>;
type DefaultNamespaceValue<Options extends I18nOptions> = Options['defaultNamespace'] extends string
    ? Options['defaultNamespace']
    : never;
type KnownNamespaceValue<Options extends I18nOptions> =
    | NamespacedBundleEntry<LocalesFromOptions<Options>>['namespace']
    | DefaultNamespaceValue<Options>;
type StringFallback<Value extends string> = [Value] extends [never] ? string : Value;
type StrictEnabled<Options extends I18nOptions> = Options['strictKey'] extends true ? true : false;

export type I18nKey<Options extends I18nOptions> =
    StrictEnabled<Options> extends true ? StringFallback<StrictLocaleKey<Options>> : string;

export type I18nNamespace<Options extends I18nOptions> =
    StrictEnabled<Options> extends true ? StringFallback<KnownNamespaceValue<Options>> : string;

export type I18nContext<Options extends I18nOptions, U extends UnknownContext> =
    StrictEnabled<Options> extends true
        ? Omit<Context<U>, 'namespace'> & { namespace?: I18nNamespace<Options> }
        : Context<U>;

interface ParsedKey {
    namespace?: string;
    keyPath: string;
    keyTrail: string[];
}

interface ResolvedEntry {
    text: string;
    language: Language;
}

class I18n<const Options extends I18nOptions = I18nOptions, U extends UnknownContext = PluginContext<Options>> {
    private language?: Language;
    private fallbackLanguages: LanguageFallbacks = [];
    private namespace?: string;
    private namespaceDelimiter: string;
    private keyDelimiter: string;
    private keyProfileCache: Map<string, ParsedKey>;
    private languageTrailCache: Map<string, Language[]>;
    private localeManager: LocaleManager;
    private pluginManager: PluginManager<Pick<Options, 'plugins'>, U>;

    constructor({
        language,
        fallbackLanguages = [],
        namespace,
        namespaceDelimiter = ':',
        keyDelimiter = '.',
        defaultNamespace,
        locales,
        localeWriteMode,
        plugins,
    }: Options) {
        this.keyProfileCache = new Map();
        this.languageTrailCache = new Map();
        this.setLanguage(language);
        this.setNamespace(namespace);
        this.setFallbackLanguages(fallbackLanguages);
        this.namespaceDelimiter = namespaceDelimiter;
        this.keyDelimiter = keyDelimiter;
        this.localeManager = new LocaleManager({ defaultNamespace, locales, localeWriteMode });
        this.pluginManager = new PluginManager({ plugins });
    }

    private parseKey(key: string): ParsedKey {
        const cached = this.keyProfileCache.get(key);
        if (cached) return cached;

        const delimiterIndex = key.indexOf(this.namespaceDelimiter);
        const hasNamespace = delimiterIndex > -1;
        const namespace = hasNamespace ? key.slice(0, delimiterIndex) : undefined;
        const keyPath = hasNamespace ? key.slice(delimiterIndex + this.namespaceDelimiter.length) : key;
        const keyTrail = keyPath.includes(this.keyDelimiter) ? keyPath.split(this.keyDelimiter) : [keyPath];
        const parsedKey = { namespace, keyPath, keyTrail };

        this.keyProfileCache.set(key, parsedKey);
        if (this.keyProfileCache.size > CACHE_LIMIT) {
            const oldest = this.keyProfileCache.keys().next();
            if (!oldest.done) this.keyProfileCache.delete(oldest.value);
        }

        return parsedKey;
    }

    private getConfiguredFallbacks(language?: Language): Language[] {
        if (isArray(this.fallbackLanguages)) return this.fallbackLanguages;
        if (!language) return [];

        const regional = language.split('-')[0];

        return this.fallbackLanguages[language] ?? this.fallbackLanguages[regional] ?? [];
    }

    private getLanguageTrail(anchorLanguage?: Language): Language[] {
        const cacheKey = anchorLanguage ?? '__contextual__';
        const cached = this.languageTrailCache.get(cacheKey);
        if (cached) return cached;

        const seen = new Set<Language>();
        const add = (lang?: Language) => {
            if (!lang || seen.has(lang)) return;
            seen.add(lang);
            const base = lang.split('-')[0] as Language;
            if (base !== lang) seen.add(base);
        };

        add(anchorLanguage);
        for (const lang of this.getConfiguredFallbacks(anchorLanguage)) add(lang);

        const trail = [...seen];
        this.languageTrailCache.set(cacheKey, trail);

        return trail;
    }

    private readText(locale: Locale, parsedKey: ParsedKey): string | undefined {
        // Fast path: check if the full keyPath exists as a literal key. Handles flat locales
        // where keys contain dots (e.g. { "home.title": "Title" }), and takes priority over traversal.
        const directText = locale[parsedKey.keyPath];
        if (typeof directText === 'string') return directText;

        let nextNode: string | Locale = locale;
        for (const keyPart of parsedKey.keyTrail) {
            const branch: Locale | undefined =
                typeof nextNode === 'object' && nextNode !== null ? (nextNode as Locale) : undefined;
            if (!branch || !(keyPart in branch)) return undefined;
            nextNode = branch[keyPart];
        }

        return typeof nextNode === 'string' ? nextNode : undefined;
    }

    private resolveEntry(
        namespace: string,
        parsedKey: ParsedKey,
        languageTrail: Language[],
    ): ResolvedEntry | undefined {
        for (const language of languageTrail) {
            const locale = this.localeManager.get({ language, namespace });
            if (!locale) continue;
            const text = this.readText(locale, parsedKey);
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

    setFallbackLanguages(fallbackLanguages: LanguageFallbacks = []) {
        this.fallbackLanguages = fallbackLanguages;
        this.languageTrailCache.clear();
    }

    addLocale(context: { language: Language; namespace?: string }, locale: Locale) {
        this.localeManager.add(context, locale);
    }

    t(key: I18nKey<Options>, context: I18nContext<Options, U> = {} as I18nContext<Options, U>) {
        const keyText = key as string;
        const { language: targetLanguage, namespace: targetNamespace } = context;
        const parsedKey = this.parseKey(keyText);
        const namespace =
            parsedKey.namespace ?? targetNamespace ?? this.namespace ?? this.localeManager.getDefaultNamespace();
        const languageTrail = this.getLanguageTrail(targetLanguage ?? this.language);
        const contextualData = { ...context, namespace } as Context<U>;
        const resolvePayload: ResolvePayload<U> = {
            key: keyText,
            resolvedKey: parsedKey.keyPath,
            namespace,
            languageTrail,
            context: contextualData,
        };

        this.pluginManager.resolving(resolvePayload);

        const entry = this.resolveEntry(namespace, parsedKey, languageTrail);
        if (!entry) {
            this.pluginManager.missing(resolvePayload);
            this.pluginManager.resolved(resolvePayload);

            return keyText;
        }

        const pluginContext = { ...context, language: entry.language, namespace } as Context<U>;
        const result = this.pluginManager.apply(entry.text, pluginContext);

        this.pluginManager.resolved({ ...resolvePayload, language: entry.language, result });

        return result;
    }
}

export default I18n;
