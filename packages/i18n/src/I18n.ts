import { isArray, isObject, isString } from '@nild/shared';
import { Locale, Context, Language, UnknownContext } from './_shared/interfaces';
import LocaleManager, { LocaleManagerOptions } from './LocaleManager';
import PluginManager, { Plugin, PluginManagerOptions, PluginContext } from './PluginManger';

interface I18nOptions<Plugins extends readonly Plugin[] = readonly Plugin[]>
    extends LocaleManagerOptions,
        PluginManagerOptions<Plugins> {
    language: Language;
    fallbackLanguages?: Language[] | Record<Language, Language[]>;
    namespace?: string;
    namespaceDelimiter?: string;
}

class I18n<Options extends I18nOptions = I18nOptions, U extends UnknownContext = PluginContext<Options>> {
    private language?: Language;
    private fallbackLanguages: Language[] | Record<Language, Language[]>;
    private namespace?: string;
    private namespaceDelimiter: string;
    private localeManager: LocaleManager;
    private pluginManager: PluginManager<Pick<Options, 'plugins'>, U>;

    constructor({
        language,
        fallbackLanguages = [],
        namespace,
        namespaceDelimiter = ':',
        defaultNamespace,
        locales,
        plugins,
    }: Options) {
        this.setLanguage(language);
        this.setNamespace(namespace);
        this.fallbackLanguages = fallbackLanguages;
        this.namespaceDelimiter = namespaceDelimiter;
        this.localeManager = new LocaleManager({ defaultNamespace, locales });
        this.pluginManager = new PluginManager({ plugins });
    }

    static create<Options extends I18nOptions>(options: Options): I18n<Options> {
        return new I18n<Options>(options);
    }

    private getContext() {
        return {
            language: [this.language]
                .concat(
                    isArray(this.fallbackLanguages)
                        ? this.fallbackLanguages
                        : this.language
                          ? (this.fallbackLanguages[this.language] ?? [])
                          : [],
                )
                .find(language =>
                    this.localeManager.has({
                        language,
                        namespace: this.namespace,
                    }),
                ),
            namespace: this.namespace ?? this.localeManager.getDefaultNamespace(),
        };
    }

    setLanguage(language?: Language) {
        this.language = language;
    }

    setNamespace(namespace?: string) {
        this.namespace = namespace;
    }

    addLocale(context: Context, locale: Locale) {
        this.localeManager.add(context, locale);
    }

    t(key: string, context: Context<U> = {} as Context<U>) {
        const { language: specifiedLanguage, namespace: specifiedNamespace } = context;
        const { language: contextualLanguage, namespace: contextualNamespace } = this.getContext();
        const parts = key.split(this.namespaceDelimiter);
        const derivedNamespace = key.includes(this.namespaceDelimiter) ? parts[0] : undefined;
        const language = specifiedLanguage ?? contextualLanguage;
        const namespace = derivedNamespace ?? specifiedNamespace ?? contextualNamespace;
        const indexKey = parts.join(this.namespaceDelimiter);

        if (!language) {
            return indexKey;
        }

        if (!this.localeManager.has({ language, namespace })) {
            return indexKey;
        }

        const locale = this.localeManager.get({ language, namespace })!;
        let result: string | Locale = locale;

        if (indexKey in locale) {
            result = locale[indexKey];
        } else {
            const keyParts = indexKey.split('.');

            for (const keyPart of keyParts) {
                if (isObject(result) && keyPart in result) {
                    result = result[keyPart];
                } else {
                    return indexKey;
                }
            }
        }

        if (!isString(result)) {
            return indexKey;
        }

        return this.pluginManager.apply(result, { ...context, language, namespace });
    }
}

export default I18n;
