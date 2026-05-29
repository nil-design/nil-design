import { describe, expect, it } from 'vitest';
import { formatDocContext, searchDocIndex, toSourceLinks } from '../services/docs/index.js';
import { composeChatRequestMessages } from '../services/openrouter/chat.js';

const index = {
    pages: [
        {
            title: 'Button 按钮',
            path: '/zh-CN/components/button/',
            chunks: ['Button 支持 solid outlined filled text 四种变体。'],
        },
        {
            title: 'Input 输入框',
            path: '/zh-CN/components/input/',
            chunks: ['Input 组件用于基础文本输入。'],
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
});
