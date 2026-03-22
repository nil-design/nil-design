import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { env, pipeline } from '@huggingface/transformers';
import getEmbeddingModel from './getEmbeddingModel.js';

env.localModelPath = resolve(process.cwd(), 'docs', 'public', 'models');
env.allowRemoteModels = false;

const BUILD_OPTIONS = Object.freeze({
    minChunkLength: 20,
    targetChunkLength: 120,
    maxChunkLength: 700,
    batchSize: 24,
});

const normalizeText = text => {
    return text
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
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

    const paragraphs = normalized
        .split(/\n{2,}/)
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length >= BUILD_OPTIONS.minChunkLength);
    const pieces = [];

    for (const paragraph of paragraphs) {
        pieces.push(...splitBySentence(paragraph, BUILD_OPTIONS.maxChunkLength));
    }

    const chunks = [];

    for (const piece of pieces) {
        const text = piece.trim();

        if (text.length < BUILD_OPTIONS.minChunkLength) {
            continue;
        }
        if (!chunks.length) {
            chunks.push(text);
            continue;
        }

        const lastIndex = chunks.length - 1;
        const lastChunk = chunks[lastIndex];

        if (
            lastChunk.length < BUILD_OPTIONS.targetChunkLength &&
            lastChunk.length + 2 + text.length <= BUILD_OPTIONS.maxChunkLength
        ) {
            chunks[lastIndex] = `${lastChunk}\n\n${text}`;
        } else {
            chunks.push(text);
        }
    }

    if (chunks.length > 1) {
        const lastIndex = chunks.length - 1;
        const previous = chunks[lastIndex - 1];
        const last = chunks[lastIndex];

        if (
            last.length < BUILD_OPTIONS.targetChunkLength &&
            previous.length + 2 + last.length <= BUILD_OPTIONS.maxChunkLength
        ) {
            chunks[lastIndex - 1] = `${previous}\n\n${last}`;
            chunks.pop();
        }
    }

    return chunks;
};

const toVectors = output => {
    const roundValue = value => Number(value.toFixed(6));

    if (Array.isArray(output)) {
        if (!output.length) {
            return [];
        }
        if (Array.isArray(output[0])) {
            return output.map(vector => vector.map(roundValue));
        }
        if (typeof output[0] === 'number') {
            return [output.map(roundValue)];
        }
    }
    if (!output?.dims || !output?.data) {
        throw new Error('Unexpected embedding output shape.');
    }
    if (output.dims.length === 1) {
        return [Array.from(output.data, roundValue)];
    }
    if (output.dims.length !== 2) {
        throw new Error(`Unexpected embedding dimensions: ${JSON.stringify(output.dims)}`);
    }

    const [rows, columns] = output.dims;
    const vectors = [];

    for (let row = 0; row < rows; row += 1) {
        const start = row * columns;
        const end = start + columns;

        vectors.push(Array.from(output.data.slice(start, end), roundValue));
    }

    return vectors;
};

class EmbeddingBuilder {
    constructor() {
        this.pages = new Map();
        this.extractPromises = new Map();
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

    async getExtractor(model) {
        const modelKey = model.key;

        if (!this.extractPromises.has(modelKey)) {
            const extractPromise = pipeline('feature-extraction', model.id, {
                dtype: model.dtype,
                local_files_only: true,
            }).catch(error => {
                this.extractPromises.delete(modelKey);
                throw error;
            });

            this.extractPromises.set(modelKey, extractPromise);
        }

        return this.extractPromises.get(modelKey);
    }

    async build(outputDir) {
        const createdAt = new Date().toISOString();
        const embeddingsDir = join(outputDir, 'embeddings');

        await rm(embeddingsDir, { recursive: true, force: true });
        await mkdir(embeddingsDir, { recursive: true });

        const locales = Array.from(this.pages.keys()).sort((left, right) => left.localeCompare(right));
        const manifest = {
            version: 2,
            createdAt,
            models: [],
            locales: [],
        };
        const models = new Map();

        if (!locales.length) {
            await writeFile(join(embeddingsDir, 'manifest.json'), JSON.stringify(manifest), 'utf8');

            return;
        }

        for (const locale of locales) {
            const model = getEmbeddingModel(locale);
            const modelMeta = model.toJSON();
            const modelKey = model.key;

            if (!models.has(modelKey)) {
                models.set(modelKey, {
                    modelKey,
                    ...modelMeta,
                });
            }

            const extractor = await this.getExtractor(model);
            const chunks = [];
            const pages = this.pages.get(locale);
            const paths = [];
            const titles = [];

            for (const [path, page] of pages.entries()) {
                const { title, content } = page;
                const pageChunks = splitContent(content);

                if (!pageChunks.length) {
                    continue;
                }

                const pageIndex = paths.length;

                paths.push(path);
                titles.push(title);

                for (const snippet of pageChunks) {
                    chunks.push({
                        pageIndex,
                        snippet,
                    });
                }
            }

            const vectors = [];

            for (let index = 0; index < chunks.length; index += BUILD_OPTIONS.batchSize) {
                const batch = chunks.slice(index, index + BUILD_OPTIONS.batchSize);
                const batchInput = batch.map(({ snippet }) => `${model.passagePrefix}${snippet}`);

                if (!batchInput.length) {
                    continue;
                }

                const output = await extractor(batchInput, {
                    pooling: model.pooling,
                    normalize: model.normalize,
                });
                const batchVectors = toVectors(output);

                if (batchVectors.length !== batch.length) {
                    throw new Error(
                        `Embedding count mismatch for locale ${locale}: expected ${batch.length}, got ${batchVectors.length}.`,
                    );
                }
                vectors.push(...batchVectors);
            }

            const dimension = vectors[0]?.length ?? 0;
            const localeChunks = chunks.map((chunk, index) => ({
                ...chunk,
                embedding: vectors[index] ?? [],
            }));
            const file = `${locale}.json`;

            await writeFile(
                join(embeddingsDir, file),
                JSON.stringify({
                    version: 2,
                    locale,
                    createdAt,
                    model: modelMeta,
                    dimension,
                    paths,
                    titles,
                    chunks: localeChunks,
                }),
                'utf8',
            );

            manifest.locales.push({
                locale,
                file,
                modelKey,
                chunkCount: localeChunks.length,
                dimension,
            });
        }

        manifest.models = Array.from(models.values());
        await writeFile(join(embeddingsDir, 'manifest.json'), JSON.stringify(manifest), 'utf8');
    }
}

const getEmbeddingBuilder = () => {
    return new EmbeddingBuilder();
};

export default getEmbeddingBuilder;
