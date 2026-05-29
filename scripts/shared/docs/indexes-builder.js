import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BUILD_OPTIONS = Object.freeze({
    minChunkLength: 20,
    targetChunkLength: 520,
    maxChunkLength: 1200,
});

const stripFrontmatter = content => content.replace(/^---[\s\S]*?---\s*/u, '');

const stripContainers = content => content.replace(/^:::\s*\w*|^:::\s*$/gmu, '');

const stripHtmlComments = content => content.replace(/<!--[\s\S]*?-->/gu, '');

const stripCodeFenceMarks = content => content.replace(/^```[\w-]*\s*$/gmu, '');

const stripMarkdownSyntax = content => {
    return content
        .replace(/!\[([^\]]*)\]\([^)]+\)/gu, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
        .replace(/`([^`]+)`/gu, '$1')
        .replace(/^[#>*+-]\s*/gmu, '')
        .replace(/\{\{\s*\$frontmatter\.([a-zA-Z_$][\w$]*)\s*\}\}/gu, '$1')
        .replace(/[ \t]+/gu, ' ');
};

const normalizeText = content => {
    return stripMarkdownSyntax(stripCodeFenceMarks(stripContainers(stripHtmlComments(stripFrontmatter(content)))))
        .replace(/\r\n?/gu, '\n')
        .replace(/[ \t]+\n/gu, '\n')
        .replace(/\n{3,}/gu, '\n\n')
        .trim();
};

const splitByLength = (text, maxLength) => {
    const chunks = [];

    for (let index = 0; index < text.length; index += maxLength) {
        const chunk = text.slice(index, index + maxLength).trim();

        if (chunk) {
            chunks.push(chunk);
        }
    }

    return chunks;
};

const splitBySentence = (text, maxLength) => {
    if (text.length <= maxLength) {
        return [text];
    }

    const sentences = text
        .split(/(?<=[\u3002\uff01\uff1f?.])\s*/u)
        .map(sentence => sentence.trim())
        .filter(Boolean);

    if (sentences.length <= 1) {
        return splitByLength(text, maxLength);
    }

    const chunks = [];
    let current = '';

    for (const sentence of sentences) {
        if (sentence.length > maxLength) {
            if (current) {
                chunks.push(current);
                current = '';
            }
            chunks.push(...splitByLength(sentence, maxLength));
            continue;
        }
        if (!current) {
            current = sentence;
            continue;
        }

        const next = `${current} ${sentence}`.trim();

        if (next.length <= maxLength) {
            current = next;
        } else {
            chunks.push(current);
            current = sentence;
        }
    }

    if (current) {
        chunks.push(current);
    }

    return chunks;
};

const splitContent = content => {
    const normalized = normalizeText(content);

    if (!normalized) {
        return [];
    }

    const pieces = normalized
        .split(/\n{2,}/u)
        .flatMap(paragraph => splitBySentence(paragraph.trim(), BUILD_OPTIONS.maxChunkLength))
        .filter(piece => piece.length >= BUILD_OPTIONS.minChunkLength);
    const chunks = [];

    for (const piece of pieces) {
        if (!chunks.length) {
            chunks.push(piece);
            continue;
        }

        const lastIndex = chunks.length - 1;
        const lastChunk = chunks[lastIndex];

        if (
            lastChunk.length < BUILD_OPTIONS.targetChunkLength &&
            lastChunk.length + 2 + piece.length <= BUILD_OPTIONS.maxChunkLength
        ) {
            chunks[lastIndex] = `${lastChunk}\n\n${piece}`;
        } else {
            chunks.push(piece);
        }
    }

    return chunks;
};

class IndexesBuilder {
    constructor() {
        this.pages = new Map();
    }

    collect({ locale, path, title = '', content }) {
        const finalPath = path.startsWith('/') ? path : `/${path}`;

        if (!this.pages.has(locale)) {
            this.pages.set(locale, new Map());
        }

        this.pages.get(locale).set(finalPath, {
            title,
            content,
        });
    }

    async build(outputDir) {
        const createdAt = new Date().toISOString();
        const indexDir = join(outputDir, 'indexes');

        await rm(indexDir, { recursive: true, force: true });
        await mkdir(indexDir, { recursive: true });

        const locales = Array.from(this.pages.keys()).sort((left, right) => left.localeCompare(right));
        const manifest = {
            version: 1,
            createdAt,
            locales: [],
        };

        for (const locale of locales) {
            const pages = [];
            const localePages = this.pages.get(locale);

            for (const [path, page] of localePages.entries()) {
                const chunks = splitContent(page.content);

                if (!chunks.length) {
                    continue;
                }

                pages.push({
                    path,
                    title: page.title,
                    chunks,
                });
            }

            const file = `${locale}.json`;

            await writeFile(
                join(indexDir, file),
                JSON.stringify({
                    version: 1,
                    locale,
                    createdAt,
                    pages,
                }),
                'utf8',
            );

            manifest.locales.push({
                locale,
                file,
                pageCount: pages.length,
                chunkCount: pages.reduce((count, page) => count + page.chunks.length, 0),
            });
        }

        await writeFile(join(indexDir, 'manifest.json'), JSON.stringify(manifest), 'utf8');
    }
}

const getIndexesBuilder = () => new IndexesBuilder();

export { getIndexesBuilder, IndexesBuilder, normalizeText, splitContent };
export default getIndexesBuilder;
