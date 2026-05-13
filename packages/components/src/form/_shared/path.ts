const INDEX_RE = /^\d+$/;

const splitPath = (path: string) => path.split('.').filter(Boolean);

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const cloneBranch = (value: unknown, nextSegment: string | undefined) => {
    if (Array.isArray(value)) {
        return [...value];
    }

    if (isRecord(value)) {
        return { ...value };
    }

    return nextSegment && INDEX_RE.test(nextSegment) ? [] : {};
};

export const getByPath = (value: Record<string, unknown>, path: string) => {
    const segments = splitPath(path);
    let cursor: unknown = value;

    for (const segment of segments) {
        if (cursor === undefined || cursor === null) {
            return undefined;
        }

        cursor = (cursor as Record<string, unknown>)[segment];
    }

    return cursor;
};

export const updateByPath = (
    formValue: Record<string, unknown>,
    path: string,
    value: unknown,
): Record<string, unknown> => {
    const segments = splitPath(path);

    if (segments.length === 0) {
        return formValue;
    }

    const sources: unknown[] = [formValue];
    let source: unknown = formValue;

    for (const segment of segments) {
        source = source == null ? undefined : (source as Record<string, unknown>)[segment];
        sources.push(source);
    }

    if (Object.is(source, value)) {
        return formValue;
    }

    const root = cloneBranch(formValue, segments[0]) as Record<string, unknown>;
    let cursor: Record<string, unknown> | unknown[] = root;

    for (let index = 0; index < segments.length - 1; index += 1) {
        const segment = segments[index];
        const nextValue = cloneBranch(sources[index + 1], segments[index + 1]);

        (cursor as Record<string, unknown>)[segment] = nextValue;
        cursor = nextValue as Record<string, unknown> | unknown[];
    }

    (cursor as Record<string, unknown>)[segments[segments.length - 1]] = value;

    return root;
};

export const collectPaths = (value: unknown, prefix = '', paths: string[] = []): string[] => {
    if (Array.isArray(value)) {
        value.forEach((item, index) => collectPaths(item, prefix ? `${prefix}.${index}` : `${index}`, paths));

        return paths;
    }

    if (isRecord(value)) {
        const keys = Object.keys(value);

        if (keys.length === 0) {
            if (prefix) {
                paths.push(prefix);
            }

            return paths;
        }

        keys.forEach(key => collectPaths(value[key], prefix ? `${prefix}.${key}` : key, paths));

        return paths;
    }

    if (prefix) {
        paths.push(prefix);
    }

    return paths;
};
