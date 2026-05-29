const CJK_PATTERN = /[\u3400-\u9fff]/u;
const TERM_SEPARATOR = /[^a-z0-9\u3400-\u9fff]+/u;
const DEFAULT_RESULT_LIMIT = 4;

const normalizeText = value => {
    return `${value || ''}`
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^a-z0-9\u3400-\u9fff]+/gu, '');
};

const getMinTermLength = term => (CJK_PATTERN.test(term) ? 1 : 2);

const scoreField = ({ normalizedValue, terms, exactBoost, includesBoost, termBoost }) => {
    if (!normalizedValue) {
        return 0;
    }

    let score = 0;

    for (const term of terms) {
        if (normalizedValue === term) {
            score += exactBoost;
        } else if (normalizedValue.includes(term)) {
            score += includesBoost;
        }
    }

    if (terms.some(term => normalizedValue.includes(term))) {
        score += termBoost;
    }

    return score;
};

export const tokenizeQuery = value => {
    const seen = new Set();

    return `${value || ''}`
        .normalize('NFKC')
        .toLowerCase()
        .split(TERM_SEPARATOR)
        .filter(term => {
            if (!term || term.length < getMinTermLength(term) || seen.has(term)) {
                return false;
            }

            seen.add(term);

            return true;
        });
};

export const searchDocIndex = (index, query, { limit = DEFAULT_RESULT_LIMIT } = {}) => {
    const terms = tokenizeQuery(query);

    if (!terms.length || !index?.pages?.length) {
        return [];
    }

    const results = [];

    for (const page of index.pages) {
        const normalizedTitle = normalizeText(page.title);
        const normalizedPath = normalizeText(page.path);

        page.chunks.forEach((chunk, chunkIndex) => {
            const normalizedChunk = normalizeText(chunk);
            const score =
                scoreField({
                    normalizedValue: normalizedTitle,
                    terms,
                    exactBoost: 12,
                    includesBoost: 8,
                    termBoost: 4,
                }) +
                scoreField({ normalizedValue: normalizedPath, terms, exactBoost: 8, includesBoost: 5, termBoost: 3 }) +
                scoreField({ normalizedValue: normalizedChunk, terms, exactBoost: 4, includesBoost: 2, termBoost: 1 });

            if (score > 0) {
                results.push({
                    title: page.title,
                    path: page.path,
                    chunk,
                    chunkIndex,
                    score,
                });
            }
        });
    }

    return results
        .sort(
            (left, right) =>
                right.score - left.score || left.path.localeCompare(right.path) || left.chunkIndex - right.chunkIndex,
        )
        .slice(0, limit);
};
