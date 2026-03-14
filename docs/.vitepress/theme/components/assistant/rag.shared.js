const CJK_PATTERN = /[\u3400-\u9fff]/u;
const MATCH_TERM_SEPARATOR = /[^a-z0-9\u3400-\u9fff]+/u;

export const RAG_MIN_SCORE = 0.62;
export const RAGStatus = Object.freeze({
    IDLE: 'idle',
    LOADING: 'loading',
    READY: 'ready',
    ERROR: 'error',
});
export const RAGActionType = Object.freeze({
    INIT: 'init',
    RETRIEVE: 'retrieve',
    DISPOSE: 'dispose',
});
export const RAGMessageType = Object.freeze({
    STATUS: 'status',
    RESPONSE: 'response',
    ERROR: 'error',
});

const normalizeText = value => {
    return `${value || ''}`
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^a-z0-9\u3400-\u9fff]+/gu, '');
};

const getMinTokenLength = value => {
    return CJK_PATTERN.test(value) ? 1 : 2;
};

const createLexicalTerms = value => {
    const seen = new Set();
    const normalized = `${value || ''}`.normalize('NFKC').toLowerCase();

    return normalized.split(MATCH_TERM_SEPARATOR).filter(term => {
        if (!term || term.length < getMinTokenLength(term) || seen.has(term)) {
            return false;
        }
        seen.add(term);

        return true;
    });
};

/**
 * prepares and validates user input for lexical matching.
 */
export const prepareLexicalQuery = query => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
        return null;
    }
    if (normalizedQuery.length < getMinTokenLength(normalizedQuery)) {
        return null;
    }

    return {
        normalizedQuery,
    };
};

/**
 * precomputes normalized lexical fields for each indexed documentation chunk.
 */
export const prepareLexicalTarget = ({ title = '', path = '', snippet = '' } = {}) => {
    const pathLeaf = path.split('/').filter(Boolean).at(-1) ?? '';

    return {
        normalizedTitle: normalizeText(title),
        normalizedPath: normalizeText(path),
        normalizedSnippet: normalizeText(snippet),
        titleTerms: createLexicalTerms(title),
        pathTerms: createLexicalTerms(pathLeaf),
    };
};

/**
 * returns a small relevance boost when lexical signals align well.
 */
export const getLexicalMatchBoost = (query, target = {}) => {
    const normalizedQuery = query?.normalizedQuery ?? '';

    if (!normalizedQuery) {
        return 0;
    }

    const {
        normalizedTitle = '',
        normalizedPath = '',
        normalizedSnippet = '',
        titleTerms = [],
        pathTerms = [],
    } = target;

    const includesAnyTerm = (value, terms = []) => {
        return terms.some(term => value.includes(term));
    };

    if (normalizedTitle === normalizedQuery) {
        return 0.28;
    }
    if (normalizedTitle.includes(normalizedQuery)) {
        return 0.22;
    }
    if (includesAnyTerm(normalizedQuery, titleTerms)) {
        return 0.22;
    }
    if (normalizedPath.includes(normalizedQuery)) {
        return 0.18;
    }
    if (includesAnyTerm(normalizedQuery, pathTerms)) {
        return 0.18;
    }
    if (normalizedSnippet.includes(normalizedQuery)) {
        return 0.08;
    }

    return 0;
};

export const createRAGPrompt = ({ basePrompt, topChunk }) => {
    return `${basePrompt}

## Documentation context
The following Nil Design documentation snippet comes from the current locale and is the authoritative source for Nil Design-specific details.
- Prefer this documentation over prior knowledge for Nil Design APIs and behavior.
- If the snippet does not cover the answer, clearly say the docs do not cover it.
- Do not invent Nil Design APIs, props, or behavior.

Path: ${topChunk.path}
Snippet:
${topChunk.snippet}`;
};

export const isStrongRagHit = score => {
    return Number.isFinite(score) && score >= RAG_MIN_SCORE;
};
