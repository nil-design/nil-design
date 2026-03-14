import { env, pipeline } from '@huggingface/transformers';
import {
    RAGActionType,
    RAGMessageType,
    RAGStatus,
    getLexicalMatchBoost,
    isStrongRagHit,
    prepareLexicalQuery,
    prepareLexicalTarget,
} from './rag.shared.js';

const SOURCE_LIMIT = 3;
const MODEL_LOADING_TEXT = 'Preparing embedding model...';
const EMBEDDING_LOAD_TEXT = 'Loading documentation embeddings...';

let extractor = null;
let workerState = null;

const postMessage = (type, ...args) => {
    switch (type) {
        case RAGMessageType.STATUS: {
            const [status, payload = {}] = args;
            const { progress = 0, text = '', ...rest } = payload;

            self.postMessage({
                type: RAGMessageType.STATUS,
                payload: {
                    progress,
                    text,
                    status,
                    ...rest,
                },
            });

            return;
        }
        case RAGMessageType.RESPONSE: {
            const [id, payload = {}] = args;

            self.postMessage({
                type: RAGMessageType.RESPONSE,
                id,
                payload,
            });

            return;
        }
        case RAGMessageType.ERROR: {
            const [id, error] = args;

            self.postMessage({
                type: RAGMessageType.ERROR,
                id,
                error: error instanceof Error ? error.message : `${error}`,
            });

            return;
        }
        default:
            throw new Error(`Unsupported post message type "${type}".`);
    }
};

const roundScore = score => {
    return Math.round(score * 1e6) / 1e6;
};

/**
 * normalizes model output to a single Float32 query vector.
 */
const toVector = output => {
    if (Array.isArray(output)) {
        if (Array.isArray(output[0])) {
            return Float32Array.from(output[0]);
        }

        return Float32Array.from(output);
    }
    if (output?.dims?.length === 1 && output?.data) {
        return new Float32Array(output.data);
    }
    if (output?.dims?.length === 2 && output?.data) {
        const columns = output.dims[1];

        return new Float32Array(output.data.slice(0, columns));
    }

    throw new Error('Unexpected query embedding output shape.');
};

const getNorm = vector => {
    let sum = 0;

    for (let index = 0; index < vector.length; index += 1) {
        sum += vector[index] * vector[index];
    }

    return Math.sqrt(sum);
};

const getCosineSimilarity = (left, leftNorm, right, rightNorm) => {
    if (!leftNorm || !rightNorm) {
        return 0;
    }

    let dot = 0;

    for (let index = 0; index < left.length; index += 1) {
        dot += left[index] * right[index];
    }

    return dot / (leftNorm * rightNorm);
};

/**
 * builds an indexed chunk record used for vector and lexical retrieval.
 */
const createIndexedChunk = (chunk, page) => {
    const snippet = chunk.snippet ?? chunk.text ?? '';
    const vector = Float32Array.from(chunk.embedding);

    return {
        pageIndex: chunk.pageIndex,
        snippet,
        vector,
        norm: getNorm(vector),
        ...prepareLexicalTarget({
            title: page.title,
            path: page.path,
            snippet,
        }),
    };
};

const dispose = async () => {
    if (extractor?.dispose) {
        await extractor.dispose();
    }

    extractor = null;
    workerState = null;
    postMessage(RAGMessageType.STATUS, RAGStatus.IDLE);
};

/**
 * loads embedding metadata and initializes the local embedding model pipeline.
 */
const init = async ({ base, locale }) => {
    const baseValue = `${base || '/'}`;
    const normalizedBase = baseValue.endsWith('/') ? baseValue : `${baseValue}/`;

    const getLoadingRatio = progress => {
        const value = progress?.progress;

        if (Number.isFinite(value)) {
            return value > 1 ? value / 100 : value;
        }
        if (Number.isFinite(progress?.loaded) && Number.isFinite(progress?.total) && progress.total > 0) {
            return progress.loaded / progress.total;
        }

        return null;
    };

    if (workerState?.locale === locale && workerState?.base === normalizedBase && extractor) {
        postMessage(RAGMessageType.STATUS, RAGStatus.READY, {
            progress: 100,
        });

        return {
            locale,
            chunkCount: workerState.chunks.length,
        };
    }

    if (extractor || workerState) {
        await dispose();
    }

    postMessage(RAGMessageType.STATUS, RAGStatus.LOADING, {
        text: EMBEDDING_LOAD_TEXT,
    });

    const response = await fetch(`${normalizedBase}embeddings/${locale}.json`);

    if (!response.ok) {
        throw new Error(`Failed to load embeddings for locale "${locale}".`);
    }

    const embeddingFile = await response.json();
    let modelLoadingProgress = 0;
    let modelLoadingText = MODEL_LOADING_TEXT;

    postMessage(RAGMessageType.STATUS, RAGStatus.LOADING, {
        progress: modelLoadingProgress,
        text: modelLoadingText,
    });

    env.allowLocalModels = true;
    env.allowRemoteModels = false;
    env.localModelPath = `${normalizedBase}models/`;

    extractor = await pipeline('feature-extraction', embeddingFile.model.id, {
        dtype: embeddingFile.model.dtype,
        local_files_only: true,
        progress_callback: progress => {
            const ratio = getLoadingRatio(progress);

            if (ratio !== null) {
                const nextProgress = Math.max(0, Math.min(100, Math.round(ratio * 100)));

                modelLoadingProgress = Math.max(modelLoadingProgress, nextProgress);
            }

            modelLoadingText = progress.file ?? progress.status ?? modelLoadingText;

            postMessage(RAGMessageType.STATUS, RAGStatus.LOADING, {
                progress: modelLoadingProgress,
                text: modelLoadingText,
            });
        },
    });

    const pages = embeddingFile.paths.map((path, pageIndex) => ({
        path,
        title: embeddingFile.titles[pageIndex],
    }));
    const chunks = embeddingFile.chunks.map(chunk => createIndexedChunk(chunk, pages[chunk.pageIndex]));

    workerState = {
        locale,
        base: normalizedBase,
        model: embeddingFile.model,
        pages,
        chunks,
    };

    postMessage(RAGMessageType.STATUS, RAGStatus.READY, {
        progress: 100,
    });

    return {
        locale,
        chunkCount: chunks.length,
    };
};

/**
 * retrieves the best-matching chunks by combining vector similarity and lexical boosts.
 */
const retrieve = async ({ query }) => {
    if (!workerState || !extractor) {
        throw new Error('RAG worker has not been initialized.');
    }

    const queryVector = toVector(
        await extractor(`${workerState.model.queryPrefix}${query}`, {
            pooling: workerState.model.pooling,
            normalize: workerState.model.normalize,
        }),
    );
    const queryNorm = getNorm(queryVector);
    const preparedQuery = prepareLexicalQuery(query);
    const sourceByPath = new Map();
    let topChunk = null;

    for (let index = 0; index < workerState.chunks.length; index += 1) {
        const chunk = workerState.chunks[index];
        const page = workerState.pages[chunk.pageIndex];
        const score =
            getCosineSimilarity(queryVector, queryNorm, chunk.vector, chunk.norm) +
            getLexicalMatchBoost(preparedQuery, chunk);

        if (!topChunk || score > topChunk.score) {
            topChunk = {
                pageIndex: chunk.pageIndex,
                snippet: chunk.snippet,
                score,
            };
        }

        const source = sourceByPath.get(page.path);

        if (!source || score > source.score || (score === source.score && index < source.chunkIndex)) {
            sourceByPath.set(page.path, {
                title: page.title,
                path: page.path,
                score,
                chunkIndex: index,
            });
        }
    }

    const topScore = topChunk ? roundScore(topChunk.score) : 0;

    if (!topChunk || !isStrongRagHit(topScore)) {
        return {
            hit: false,
            topScore,
            sources: [],
        };
    }

    const topPage = workerState.pages[topChunk.pageIndex];
    const sources = Array.from(sourceByPath.values())
        .sort((left, right) => right.score - left.score || left.chunkIndex - right.chunkIndex)
        .slice(0, SOURCE_LIMIT);

    return {
        hit: true,
        topChunk: {
            path: topPage.path,
            title: topPage.title,
            snippet: topChunk.snippet,
            score: topScore,
        },
        topScore,
        sources: sources.map(({ title, path, score }) => ({
            title,
            path,
            score: roundScore(score),
        })),
    };
};

self.onmessage = async event => {
    const { id, type, payload = {} } = event.data ?? {};

    try {
        switch (type) {
            case RAGActionType.INIT:
                postMessage(RAGMessageType.RESPONSE, id, await init(payload));
                break;
            case RAGActionType.RETRIEVE:
                postMessage(RAGMessageType.RESPONSE, id, await retrieve(payload));
                break;
            case RAGActionType.DISPOSE:
                await dispose();
                postMessage(RAGMessageType.RESPONSE, id, { disposed: true });
                break;
            default:
                throw new Error(`Unsupported RAG worker action "${type}".`);
        }
    } catch (error) {
        postMessage(RAGMessageType.STATUS, RAGStatus.ERROR, {
            message: error instanceof Error ? error.message : `${error}`,
        });
        postMessage(RAGMessageType.ERROR, id, error);
    }
};
