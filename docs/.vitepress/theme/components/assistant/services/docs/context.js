const getSourcePath = source => (source.anchor ? `${source.path}#${source.anchor}` : source.path);

export const formatDocContext = sources => {
    if (!sources.length) {
        return '';
    }

    return sources
        .map((source, index) => {
            return [
                `Source ${index + 1}`,
                `Title: ${source.title}`,
                source.heading && source.heading !== source.title ? `Heading: ${source.heading}` : '',
                `Path: ${getSourcePath(source)}`,
                `Kind: ${source.kind || 'guide'}`,
                'Snippet:',
                source.text,
            ]
                .filter(Boolean)
                .join('\n');
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
            path: getSourcePath(source),
            heading: source.heading,
            score: source.score,
        });
    }

    return links;
};
