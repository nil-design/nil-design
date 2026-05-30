const CJK_PATTERN = /[\u3400-\u9fff]/u;
const DEFAULT_RESULT_LIMIT = 4;

const normalizeRoutePath = value => {
    const path = `${value || ''}`.split(/[?#]/u)[0];

    if (!path) {
        return '';
    }

    return path
        .replace(/index\.html$/u, '')
        .replace(/\.html$/u, '/')
        .replace(/\/+$/u, '/');
};

const getRouteGroup = value => {
    const segments = normalizeRoutePath(value).split('/').filter(Boolean);

    return segments.length >= 2 ? `/${segments[0]}/${segments[1]}/` : '';
};

const getRouteBoost = ({ path, routePath }) => {
    const route = normalizeRoutePath(routePath);

    if (!route) {
        return 0;
    }

    const target = normalizeRoutePath(path);

    if (target === route) {
        return 12;
    }

    return getRouteGroup(target) && getRouteGroup(target) === getRouteGroup(route) ? 3 : 0;
};

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
    const tokens = [];
    const normalized = `${value || ''}`.normalize('NFKC').toLowerCase();
    const parts = normalized.match(/[a-z0-9]+|[\u3400-\u9fff]/gu) || [];

    for (const part of parts) {
        if (!part || (!CJK_PATTERN.test(part) && part.length < 2) || seen.has(part)) {
            continue;
        }

        seen.add(part);
        tokens.push(part);
    }

    return tokens;
};

export const searchDocIndex = (index, query, { limit = DEFAULT_RESULT_LIMIT, routePath = '' } = {}) => {
    const terms = tokenizeQuery(query);

    if (!terms.length || index?.version !== 2 || !index?.pages?.length) {
        return [];
    }

    const results = [];

    for (const page of index.pages) {
        const routeBoost = getRouteBoost({ path: page.path, routePath });

        (page.chunks || []).forEach((chunk, chunkIndex) => {
            const lexicalScore =
                scoreField({
                    normalizedValue: page.normalizedTitle,
                    terms,
                    exactBoost: 12,
                    includesBoost: 8,
                    termBoost: 4,
                }) +
                scoreField({
                    normalizedValue: page.normalizedPath,
                    terms,
                    exactBoost: 8,
                    includesBoost: 5,
                    termBoost: 3,
                }) +
                scoreField({
                    normalizedValue: chunk.normalizedHeading,
                    terms,
                    exactBoost: 8,
                    includesBoost: 5,
                    termBoost: 3,
                }) +
                scoreField({
                    normalizedValue: chunk.normalizedText,
                    terms,
                    exactBoost: 4,
                    includesBoost: 2,
                    termBoost: 1,
                });

            if (lexicalScore > 0) {
                results.push({
                    id: chunk.id,
                    title: page.title,
                    path: page.path,
                    anchor: chunk.anchor,
                    heading: chunk.heading,
                    kind: chunk.kind,
                    text: chunk.text,
                    chunkIndex,
                    score: lexicalScore + routeBoost,
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
