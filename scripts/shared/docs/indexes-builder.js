import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const INDEX_SCHEMA_VERSION = 2;

const BUILD_OPTIONS = Object.freeze({
    minChunkLength: 20,
    targetChunkLength: 520,
    maxChunkLength: 1200,
});

const stripFrontmatter = content => content.replace(/^---[\s\S]*?---\s*/u, '');

const stripContainers = content => content.replace(/^:::\s*.*$/gmu, '');

const stripHtmlComments = content => content.replace(/<!--[\s\S]*?-->/gu, '');

const stripCodeFenceMarks = content => content.replace(/^```.*$/gmu, '');

const stripMarkdownSyntax = content => {
    return content
        .replace(/!\[([^\]]*)\]\([^)]+\)/gu, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
        .replace(/`([^`]+)`/gu, '$1')
        .replace(/^[#>*+-]\s*/gmu, '')
        .replace(/\{\{\s*\$frontmatter\.([a-zA-Z_$][\w$]*)\s*\}\}/gu, '$1')
        .replace(/[ \t]+/gu, ' ');
};

const resolveFrontmatterRefs = (content, frontmatter) => {
    return content.replace(/\{\{\s*\$frontmatter\.([a-zA-Z_$][\w$]*)\s*\}\}/gu, (match, key) => {
        return frontmatter?.[key] ?? match;
    });
};

const normalizeLineEndings = content => content.replace(/\r\n?/gu, '\n');

const normalizeWhitespace = content => {
    return content
        .replace(/[ \t]+\n/gu, '\n')
        .replace(/\n{3,}/gu, '\n\n')
        .trim();
};

const cleanInlineText = content => {
    return stripMarkdownSyntax(`${content || ''}`)
        .replace(/<[^>]+>/gu, '')
        .replace(/\s+/gu, ' ')
        .trim();
};

const normalizeText = content => {
    return normalizeWhitespace(
        stripMarkdownSyntax(stripCodeFenceMarks(stripContainers(stripHtmlComments(stripFrontmatter(content))))),
    );
};

const normalizeSearchText = value => {
    return `${value || ''}`
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^a-z0-9\u3400-\u9fff]+/gu, '');
};

const createAnchor = value => {
    return cleanInlineText(value)
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^\w\u3400-\u9fff]+/gu, '-')
        .replace(/^-+|-+$/gu, '')
        .replace(/-+/gu, '-');
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

const splitNormalizedText = normalized => {
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

const splitContent = content => splitNormalizedText(normalizeText(content));

const classifySection = ({ path, heading, raw, codeBlock, containerBlock }) => {
    const value = `${heading}\n${raw}`.toLowerCase();

    if (path.includes('/changelog/')) {
        return 'changelog';
    }
    if (/props?\b/u.test(value) || /\|\s*属性名\s*\|/u.test(raw) || /\|\s*property\s*\|/iu.test(raw)) {
        return 'api';
    }
    if (codeBlock || containerBlock) {
        return 'example';
    }

    return 'guide';
};

const extractSections = ({ content, path, title }) => {
    const source = normalizeLineEndings(
        stripHtmlComments(stripFrontmatter(resolveFrontmatterRefs(content, { title }))),
    );
    const sections = [];
    let section = {
        anchor: '',
        codeBlock: false,
        containerBlock: false,
        heading: title || 'Nil Design',
        lines: [],
    };
    let inCode = false;

    const flush = () => {
        const raw = section.lines.join('\n');
        const text = normalizeText(raw);

        if (!text) {
            return;
        }

        sections.push({
            anchor: section.anchor,
            heading: section.heading,
            kind: classifySection({
                path,
                heading: section.heading,
                raw,
                codeBlock: section.codeBlock,
                containerBlock: section.containerBlock,
            }),
            text,
        });
    };

    for (const line of source.split('\n')) {
        if (/^```/u.test(line.trim())) {
            section.codeBlock = true;
            inCode = !inCode;
            section.lines.push(line);
            continue;
        }

        if (!inCode && /^:::/u.test(line.trim())) {
            section.containerBlock = true;
            section.lines.push(line);
            continue;
        }

        const headingMatch = !inCode ? line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/u) : null;

        if (headingMatch) {
            flush();
            section = {
                anchor: createAnchor(headingMatch[2]),
                codeBlock: false,
                containerBlock: false,
                heading: cleanInlineText(headingMatch[2]) || title || 'Nil Design',
                lines: [],
            };
            continue;
        }

        section.lines.push(line);
    }

    flush();

    return sections;
};

const splitPageContent = page => {
    return extractSections(page).flatMap((section, sectionIndex) =>
        splitNormalizedText(section.text).map((text, chunkIndex) => {
            const id = `${page.path}#${sectionIndex}-${chunkIndex}`;
            const normalizedHeading = normalizeSearchText(section.heading);
            const normalizedText = normalizeSearchText(text);

            return {
                id,
                anchor: section.anchor,
                heading: section.heading,
                kind: section.kind,
                text,
                normalizedHeading,
                normalizedText,
            };
        }),
    );
};

const createPageRecord = page => {
    return {
        path: page.path,
        title: page.title,
        normalizedPath: normalizeSearchText(page.path),
        normalizedTitle: normalizeSearchText(page.title),
        chunks: splitPageContent(page),
    };
};

const stringifyJson = value => JSON.stringify(value);

const createHashValue = value => createHash('sha256').update(value).digest('hex').slice(0, 16);

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
            path: finalPath,
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
        const defaultLocale = locales.includes('zh-CN') ? 'zh-CN' : locales[0];
        const manifest = {
            version: INDEX_SCHEMA_VERSION,
            createdAt,
            defaultLocale,
            buildOptions: BUILD_OPTIONS,
            locales: [],
        };

        for (const locale of locales) {
            const pages = [];
            const localePages = this.pages.get(locale);

            for (const page of localePages.values()) {
                const record = createPageRecord(page);

                if (!record.chunks.length) {
                    continue;
                }

                pages.push(record);
            }

            const file = `${locale}.json`;
            const output = stringifyJson({
                version: INDEX_SCHEMA_VERSION,
                locale,
                createdAt,
                buildOptions: BUILD_OPTIONS,
                pages,
            });

            await writeFile(join(indexDir, file), output, 'utf8');

            manifest.locales.push({
                locale,
                file,
                pageCount: pages.length,
                chunkCount: pages.reduce((count, page) => count + page.chunks.length, 0),
                hash: createHashValue(output),
            });
        }

        await writeFile(join(indexDir, 'manifest.json'), stringifyJson(manifest), 'utf8');
    }
}

const createIndexesBuilder = () => new IndexesBuilder();

export {
    BUILD_OPTIONS,
    INDEX_SCHEMA_VERSION,
    IndexesBuilder,
    createIndexesBuilder,
    normalizeSearchText,
    normalizeText,
    splitContent,
    splitPageContent,
};
export default createIndexesBuilder;
