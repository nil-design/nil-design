import { describe, expect, it, vi } from 'vitest';
import { createDocService, formatDocContext, searchDocIndex, toSourceLinks } from '../services/docs/index.js';
import { composeChatRequestMessages } from '../services/openrouter/chat.js';

const index = {
    version: 2,
    pages: [
        {
            title: 'Button 按钮',
            path: '/zh-CN/components/button/',
            normalizedPath: 'zhcncomponentsbutton',
            normalizedTitle: 'button按钮',
            chunks: [
                {
                    id: 'button-variants',
                    heading: 'Button 按钮',
                    kind: 'guide',
                    text: 'Button 支持 solid outlined filled text 四种变体。',
                    normalizedHeading: 'button按钮',
                    normalizedText: 'button支持solidoutlinedfilledtext四种变体',
                },
            ],
        },
        {
            title: 'Input 输入框',
            path: '/zh-CN/components/input/',
            normalizedPath: 'zhcncomponentsinput',
            normalizedTitle: 'input输入框',
            chunks: [
                {
                    id: 'input-basic',
                    heading: 'Input 输入框',
                    kind: 'guide',
                    text: 'Input 组件用于基础文本输入。',
                    normalizedHeading: 'input输入框',
                    normalizedText: 'input组件用于基础文本输入',
                },
            ],
        },
    ],
};

describe('assistant document context', () => {
    it('returns stable lexical matches by title and body', () => {
        const matches = searchDocIndex(index, 'Button variant');

        expect(matches[0]).toMatchObject({
            title: 'Button 按钮',
            path: '/zh-CN/components/button/',
        });
    });

    it('formats context and unique source links for chat prompts', () => {
        const matches = searchDocIndex(index, 'Input');
        const context = formatDocContext(matches);
        const sources = toSourceLinks(matches);

        expect(context).toContain('Title: Input 输入框');
        expect(context).toContain('Path: /zh-CN/components/input/');
        expect(sources).toEqual([
            expect.objectContaining({
                title: 'Input 输入框',
                path: '/zh-CN/components/input/',
            }),
        ]);
    });

    it('adds documentation context without inventing it when no sources match', () => {
        const withContext = composeChatRequestMessages({
            history: [],
            userContent: 'Button 怎么用？',
            docContext: 'Source 1\nTitle: Button 按钮',
        });
        const withoutContext = composeChatRequestMessages({
            history: [],
            userContent: '未知组件怎么用？',
            docContext: '',
        });

        expect(withContext.at(-1).content).toContain('Documentation context');
        expect(withoutContext.at(-1).content).toBe('未知组件怎么用？');
    });

    it('adds locale response guidance when locale is provided', () => {
        const messages = composeChatRequestMessages({
            history: [],
            locale: 'zh-CN',
            userContent: 'How do I use Button?',
            docContext: '',
        });

        expect(messages.at(-1).content).toContain('current documentation locale is zh-CN');
        expect(messages.at(-1).content).toContain('How do I use Button?');
    });

    it('loads indexes through the manifest and falls back to a usable locale', async () => {
        const fetcher = vi.fn(async url => {
            if (url.endsWith('/indexes/manifest.json')) {
                return {
                    ok: true,
                    json: async () => ({
                        version: 2,
                        defaultLocale: 'zh-CN',
                        locales: [
                            { locale: 'en-US', file: 'en-US.json', chunkCount: 0 },
                            { locale: 'zh-CN', file: 'zh-CN.json', chunkCount: 1, hash: 'hash' },
                        ],
                    }),
                };
            }

            return {
                ok: true,
                json: async () => ({
                    version: 2,
                    locale: 'zh-CN',
                    pages: [
                        {
                            title: 'Button 按钮',
                            path: '/zh-CN/components/button/',
                            normalizedTitle: 'button按钮',
                            normalizedPath: 'zhcncomponentsbutton',
                            chunks: [
                                {
                                    id: 'button',
                                    heading: 'Button 按钮',
                                    kind: 'guide',
                                    text: 'Button 支持 outlined 变体。',
                                    normalizedHeading: 'button按钮',
                                    normalizedText: 'button支持outlined变体',
                                },
                            ],
                        },
                    ],
                }),
            };
        });
        const docs = createDocService({ fetcher });
        const result = await docs.retrieveContext({
            base: '/nil-design/',
            locale: 'en-US',
            query: 'outlined',
            routePath: '/zh-CN/components/button/',
        });

        expect(fetcher).toHaveBeenCalledWith('/nil-design/indexes/manifest.json');
        expect(fetcher).toHaveBeenCalledWith('/nil-design/indexes/zh-CN.json');
        expect(result).toMatchObject({
            available: true,
            locale: 'zh-CN',
            sources: [expect.objectContaining({ path: '/zh-CN/components/button/' })],
        });
    });
});
