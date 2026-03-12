import { isPlainObject, merge } from '@nild/shared';
import type { Context, Language, Locale } from './_shared/interfaces';

export interface NamespacedLocaleEntry {
    namespace: string;
    locale: Locale;
}

export type SerializedLocaleBundle = Locale | readonly NamespacedLocaleEntry[];

export type SerializedLocales = Record<string, SerializedLocaleBundle>;

export type LocaleWriteMode = 'merge' | 'replace';

export interface LocaleManagerOptions {
    defaultNamespace?: string;
    locales?: SerializedLocales;
    localeWriteMode?: LocaleWriteMode;
}

class LocaleManager {
    private defaultNamespace: string;
    private locales: Map<Language, Map<string, Locale>>;
    private localeWriteMode: LocaleWriteMode;

    constructor({
        defaultNamespace,
        locales: serializedLocales = {},
        localeWriteMode = 'merge',
    }: LocaleManagerOptions = {}) {
        this.defaultNamespace = defaultNamespace ?? '__default';
        this.locales = new Map();
        this.localeWriteMode = localeWriteMode;

        for (const [language, maybeLocale] of Object.entries(serializedLocales) as [
            Language,
            SerializedLocaleBundle,
        ][]) {
            const plainLocale = isPlainObject(maybeLocale);
            if (plainLocale) {
                this.add({ language }, maybeLocale as Locale);
            } else {
                for (const { namespace, locale } of maybeLocale as readonly NamespacedLocaleEntry[]) {
                    this.add({ language, namespace }, locale);
                }
            }
        }
    }

    getDefaultNamespace() {
        return this.defaultNamespace;
    }

    has(context: Context) {
        const { language, namespace = this.defaultNamespace } = context;

        return language ? (this.locales.get(language)?.has(namespace) ?? false) : false;
    }

    get(context: Context) {
        const { language, namespace = this.defaultNamespace } = context;

        return language ? this.locales.get(language)?.get(namespace) : undefined;
    }

    add(context: Context, locale: Locale, writeMode = this.localeWriteMode) {
        const { language, namespace = this.defaultNamespace } = context;
        if (!language) return;

        if (!this.locales.has(language)) this.locales.set(language, new Map());
        const nsLocaleMap = this.locales.get(language)!;

        const localeCurrent = nsLocaleMap.get(namespace);
        const replacing = writeMode === 'replace';

        if (!localeCurrent || replacing) {
            nsLocaleMap.set(namespace, locale);
        } else {
            nsLocaleMap.set(namespace, merge({}, localeCurrent, locale));
        }
    }

    remove(context: Context) {
        const { language, namespace } = context;
        if (!language || !this.locales.has(language)) return;
        const nsLocaleMap = this.locales.get(language)!;
        if (namespace) {
            nsLocaleMap.delete(namespace);
        } else {
            this.locales.delete(language);
        }
    }

    clear() {
        for (const [, nsLocaleMap] of this.locales) {
            nsLocaleMap.clear();
        }
        this.locales.clear();
    }
}

export default LocaleManager;
