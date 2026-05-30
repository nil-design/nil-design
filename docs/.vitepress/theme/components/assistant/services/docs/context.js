const EXAMPLE_KIND = 'example';

const getSourcePath = source => (source.anchor ? `${source.path}#${source.anchor}` : source.path);

const getDisplaySources = sources => {
    const pathsWithPreferredSource = new Set(
        sources.filter(source => source.kind !== EXAMPLE_KIND).map(source => source.path),
    );

    return sources.filter(source => source.kind !== EXAMPLE_KIND || !pathsWithPreferredSource.has(source.path));
};

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

    for (const source of getDisplaySources(sources)) {
        const sectionPath = getSourcePath(source);

        if (seen.has(sectionPath)) {
            continue;
        }

        seen.add(sectionPath);
        links.push({
            title: source.title,
            pageTitle: source.title,
            pagePath: source.path,
            heading: source.heading,
            sectionTitle: source.heading,
            sectionPath,
            path: sectionPath,
            kind: source.kind || 'guide',
            score: source.score,
        });
    }

    return links;
};
