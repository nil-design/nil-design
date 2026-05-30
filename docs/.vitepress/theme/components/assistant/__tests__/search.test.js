import { describe, expect, it } from 'vitest';
import { searchDocIndex } from '../services/docs/index.js';

const createChunk = ({ text, heading = 'Button', anchor = '', kind = 'guide' }) => ({
    id: `${heading}-${anchor || 'top'}`,
    anchor,
    heading,
    kind,
    text,
    normalizedHeading: heading.toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/gu, ''),
    normalizedText: text.toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/gu, ''),
});

describe('assistant document search index', () => {
    it('searches v2 pre-normalized chunk fields', () => {
        const index = {
            version: 2,
            pages: [
                {
                    title: 'Button',
                    path: '/components/button/',
                    normalizedPath: 'componentsbutton',
                    normalizedTitle: 'button',
                    chunks: [createChunk({ text: 'Variants include solid and outlined.' })],
                },
            ],
        };
        const matches = searchDocIndex(index, 'outlined');

        expect(matches).toEqual([
            expect.objectContaining({
                title: 'Button',
                path: '/components/button/',
                text: 'Variants include solid and outlined.',
            }),
        ]);
    });

    it('boosts matching chunks from the current route without returning unrelated chunks', () => {
        const index = {
            version: 2,
            pages: [
                {
                    title: 'Button',
                    path: '/zh-CN/components/button/',
                    normalizedPath: 'zhcncomponentsbutton',
                    normalizedTitle: 'button',
                    chunks: [createChunk({ text: 'Button variants include solid and outlined.' })],
                },
                {
                    title: 'Input',
                    path: '/zh-CN/components/input/',
                    normalizedPath: 'zhcncomponentsinput',
                    normalizedTitle: 'input',
                    chunks: [createChunk({ heading: 'Input', text: 'Input variants include outlined.' })],
                },
            ],
        };

        const matches = searchDocIndex(index, 'outlined', { routePath: '/zh-CN/components/input/' });

        expect(matches[0]).toMatchObject({
            title: 'Input',
            path: '/zh-CN/components/input/',
        });
        expect(searchDocIndex(index, 'notfound', { routePath: '/zh-CN/components/input/' })).toEqual([]);
    });
});
