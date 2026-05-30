import { describe, expect, it } from 'vitest';
import { normalizeText, splitContent, splitPageContent } from '../indexes-builder.js';

describe('indexes builder', () => {
    it('normalizes markdown into searchable text chunks', () => {
        const normalized = normalizeText(`---
title: Button
---

# Button 按钮

::: react-live
\`\`\`tsx
<Button>OK</Button>
\`\`\`
:::

| 属性名 | 描述 |
| :-- | :-- |
| variant | 按钮变体。 |
`);

        expect(normalized).toContain('Button 按钮');
        expect(normalized).toContain('<Button>OK</Button>');
        expect(normalized).toContain('variant | 按钮变体');
    });

    it('splits long content while preserving useful short paragraphs', () => {
        const chunks = splitContent(
            ['Button 支持多种变体，并可以通过 size 调整尺寸。', 'Input 用于文本输入。'.repeat(120)].join('\n\n'),
        );

        expect(chunks.length).toBeGreaterThan(1);
        expect(chunks[0]).toContain('Button 支持多种变体');
    });

    it('keeps API table text from VitePress-expanded markdown', () => {
        const chunks = splitContent('### Button Props\n\n| 属性名 | 描述 |\n| :-- | :-- |\n| variant | 视觉样式。 |\n');

        expect(chunks.join('\n')).toContain('variant | 视觉样式');
    });

    it('creates semantic chunks with heading metadata and normalized search fields', () => {
        const chunks = splitPageContent({
            path: '/zh-CN/components/button/',
            title: 'Button 按钮',
            content: `# {{ $frontmatter.title }}

基础说明。

## API

### Button Props

| 属性名 | 描述 |
| :-- | :-- |
| variant | 视觉样式。 |
`,
        });

        expect(chunks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    heading: 'Button Props',
                    anchor: 'button-props',
                    kind: 'api',
                    normalizedHeading: 'buttonprops',
                    normalizedText: expect.stringContaining('variant'),
                }),
            ]),
        );
    });
});
