export type Language = string;

export interface Locale {
    [key: string]: string | Locale;
}

export type SerializedLocales = Record<Language, Record<string, Locale>>;

export type UnknownContext = Record<string, unknown>;

export type TranslationContext<Context extends UnknownContext = UnknownContext> = Context & {
    language?: Language;
    namespace?: string;
};

export type FallbackLanguages = Language[] | Record<string, Language[]>;

export type LocaleWriteMode = 'merge' | 'replace';
