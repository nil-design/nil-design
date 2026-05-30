import { describe, expect, it } from 'vitest';
import { normalizeDocIndex, searchDocIndex } from '../services/docs/index.js';

const index = {
    pages: [
        {
            title: 'Button',
            path: '/components/button/',
            chunks: ['Variants include solid and outlined.'],
        },
    ],
};

describe('assistant document search index', () => {
    it('precomputes normalized fields without changing search results', () => {
        const normalizedIndex = normalizeDocIndex(index);
        const plainMatches = searchDocIndex(index, 'outlined');
        const normalizedMatches = searchDocIndex(normalizedIndex, 'outlined');

        expect(normalizedIndex.pages[0]).toMatchObject({
            normalizedPath: 'componentsbutton',
            normalizedTitle: 'button',
            normalizedChunks: ['variantsincludesolidandoutlined'],
        });
        expect(normalizedMatches).toEqual(plainMatches);
    });
});
