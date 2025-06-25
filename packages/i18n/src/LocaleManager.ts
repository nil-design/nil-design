import { isPlainObject, merge, uuid } from '@nild/shared';
import type { Context, Language, Locale } from './_shared/interfaces';

export type SerializedLocales =
    | Record<string, never>
    | Record<Language, Locale>
    | Record<Language, { namespace: string; locale: Locale }[]>;

export interface LocaleManagerOptions {
    defaultNamespace?: string;
    locales?: SerializedLocales;
}

class LocaleManager {
    private defaultNamespace: string;
    private locales: Map<Language, Map<string, Locale>>;

    constructor({ defaultNamespace, locales: serializedLocales = {} }: LocaleManagerOptions = {}) {
        this.defaultNamespace = defaultNamespace ?? uuid();
        this.locales = new Map();

        for (const [language, maybeLocale] of Object.entries(serializedLocales) as [
            Language,
            Locale | { namespace: string; locale: Locale }[],
        ][]) {
            if (isPlainObject(maybeLocale)) {
                this.add({ language }, maybeLocale as Locale);
            } else {
                for (const { namespace, locale } of maybeLocale as { namespace: string; locale: Locale }[]) {
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

    add(context: Context, locale: Locale) {
        const { language, namespace = this.defaultNamespace } = context;
        if (!language) return;
        if (!this.locales.has(language)) this.locales.set(language, new Map());
        const nsLocaleMap = this.locales.get(language)!;
        if (!nsLocaleMap.has(namespace)) {
            nsLocaleMap.set(namespace, locale);
        } else {
            nsLocaleMap.set(namespace, merge(nsLocaleMap.get(namespace)!, locale));
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
