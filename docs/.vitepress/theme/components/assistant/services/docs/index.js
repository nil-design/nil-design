import { formatDocContext, toSourceLinks } from './context';
import { searchDocIndex } from './search';

export class DocService {
    indexCache = new Map();

    async loadIndex({ base = '/', locale }) {
        const baseValue = `${base || '/'}`;
        const normalizedBase = baseValue.endsWith('/') ? baseValue : `${baseValue}/`;
        const cacheKey = `${normalizedBase}${locale}`;

        if (this.indexCache.has(cacheKey)) {
            return this.indexCache.get(cacheKey);
        }

        const promise = fetch(`${normalizedBase}indexes/${locale}.json`).then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load assistant index for locale "${locale}".`);
            }

            return response.json();
        });

        this.indexCache.set(cacheKey, promise);

        return promise;
    }

    async retrieve({ base, locale, query }) {
        try {
            const index = await this.loadIndex({ base, locale });
            const matches = searchDocIndex(index, query);

            return {
                loaded: true,
                sources: toSourceLinks(matches),
                context: formatDocContext(matches),
            };
        } catch (error) {
            return {
                loaded: false,
                error,
                sources: [],
                context: '',
            };
        }
    }
}

export const createDocService = () => new DocService();

export { formatDocContext, searchDocIndex, toSourceLinks };
