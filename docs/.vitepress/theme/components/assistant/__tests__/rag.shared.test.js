import { describe, expect, it } from 'vitest';
import {
    RAG_MIN_SCORE,
    createRAGPrompt,
    getLexicalMatchBoost,
    isStrongRagHit,
    prepareLexicalQuery,
    prepareLexicalTarget,
} from '../rag.shared.js';

const lexicalBoost = input => {
    return getLexicalMatchBoost(prepareLexicalQuery(input.query), prepareLexicalTarget(input));
};

describe('rag.shared', () => {
    it('uses the fixed similarity threshold for hit detection', () => {
        expect(isStrongRagHit(RAG_MIN_SCORE)).toBe(true);
        expect(isStrongRagHit(RAG_MIN_SCORE - 0.000001)).toBe(false);
    });

    it('boosts exact title and path matches for short documentation queries', () => {
        expect(
            lexicalBoost({
                query: 'Button',
                title: 'Button Button',
                path: '/nil-design/zh-CN/components/button/',
                snippet: 'Component docs',
            }),
        ).toBeGreaterThan(0);
    });

    it('boosts natural language queries when they mention a documentation title term', () => {
        expect(
            lexicalBoost({
                query: '帮我写一个 Icon 组件的用例',
                title: 'Icon 图标',
                path: '/nil-design/zh-CN/components/icon/',
                snippet: 'Icon 组件文档',
            }),
        ).toBeGreaterThan(0);
    });

    it('builds a system prompt that appends documentation context', () => {
        const prompt = createRAGPrompt({
            basePrompt: 'Base prompt',
            topChunk: {
                path: '/nil-design/zh-CN/components/button/',
                snippet: 'Button docs snippet',
            },
        });

        expect(prompt).toContain('Base prompt');
        expect(prompt).toContain('/nil-design/zh-CN/components/button/');
        expect(prompt).toContain('Button docs snippet');
    });
});
