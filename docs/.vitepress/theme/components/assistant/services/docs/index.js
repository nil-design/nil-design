import { formatDocContext, toSourceLinks } from './context';
import { searchDocIndex } from './search';

const normalizeBase = base => {
    const value = `${base || '/'}`;

    return value.endsWith('/') ? value : `${value}/`;
};

const getUsableLocaleEntry = ({ manifest, locale }) => {
    const locales = manifest?.locales || [];
    const exact = locales.find(item => item.locale === locale && item.chunkCount > 0);

    if (exact) {
        return exact;
    }

    const fallbackLocale = manifest?.defaultLocale;
    const fallback = locales.find(item => item.locale === fallbackLocale && item.chunkCount > 0);

    return fallback ?? locales.find(item => item.chunkCount > 0);
};

export class DocService {
    constructor({ fetcher = fetch } = {}) {
        this.fetcher = fetcher;
    }

    indexCache = new Map();

    manifestCache = new Map();

    async loadManifest({ base = '/' }) {
        const normalizedBase = normalizeBase(base);

        if (this.manifestCache.has(normalizedBase)) {
            return this.manifestCache.get(normalizedBase);
        }

        const promise = this.fetcher(`${normalizedBase}indexes/manifest.json`).then(response => {
            if (!response.ok) {
                throw new Error('Failed to load assistant index manifest.');
            }

            return response.json();
        });

        this.manifestCache.set(normalizedBase, promise);

        return promise;
    }

    async loadIndex({ base = '/', locale }) {
        const normalizedBase = normalizeBase(base);
        const manifest = await this.loadManifest({ base: normalizedBase });
        const entry = getUsableLocaleEntry({ manifest, locale });

        if (!entry?.file) {
            throw new Error(`No assistant index is available for locale "${locale}".`);
        }

        const cacheKey = `${normalizedBase}${entry.file}:${entry.hash || ''}`;

        if (this.indexCache.has(cacheKey)) {
            return this.indexCache.get(cacheKey);
        }

        const promise = this.fetcher(`${normalizedBase}indexes/${entry.file}`).then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load assistant index "${entry.file}".`);
            }

            return response.json();
        });

        this.indexCache.set(cacheKey, promise);

        return promise;
    }

    async retrieveContext({ base, locale, query, routePath }) {
        try {
            const index = await this.loadIndex({ base, locale });
            const matches = searchDocIndex(index, query, { routePath });

            return {
                available: true,
                locale: index.locale,
                sources: toSourceLinks(matches),
                context: formatDocContext(matches),
                warnings: [],
            };
        } catch (error) {
            return {
                available: false,
                error,
                sources: [],
                context: '',
                warnings: ['index-unavailable'],
            };
        }
    }
}

export const createDocService = options => new DocService(options);

export { formatDocContext, searchDocIndex, toSourceLinks };
