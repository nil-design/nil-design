export const formatDocContext = sources => {
    if (!sources.length) {
        return '';
    }

    return sources
        .map((source, index) => {
            return [
                `Source ${index + 1}`,
                `Title: ${source.title}`,
                `Path: ${source.path}`,
                'Snippet:',
                source.chunk,
            ].join('\n');
        })
        .join('\n\n');
};

export const toSourceLinks = sources => {
    const seen = new Set();
    const links = [];

    for (const source of sources) {
        if (seen.has(source.path)) {
            continue;
        }

        seen.add(source.path);
        links.push({
            title: source.title,
            path: source.path,
            score: source.score,
        });
    }

    return links;
};
