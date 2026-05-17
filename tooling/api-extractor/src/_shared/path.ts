import { isAbsolute, relative, resolve } from 'node:path';

export const normalizePath = (path: string) => path.replace(/\\/g, '/');

export const toAbsolute = (cwd: string, path: string) => (isAbsolute(path) ? path : resolve(cwd, path));

export const toRelative = (cwd: string, path: string) => normalizePath(relative(cwd, path));

export const toNormalizedAbsolute = (cwd: string, path: string) => normalizePath(toAbsolute(cwd, path));

export const isSamePath = (left: string, right: string) => {
    const normalizedLeft = normalizePath(left);
    const normalizedRight = normalizePath(right);

    return normalizedLeft === normalizedRight || normalizedLeft.toLowerCase() === normalizedRight.toLowerCase();
};

export const sourceMatchesPath = (sourcePath: string, targetPath: string, cwd: string) => {
    const normalizedSource = normalizePath(sourcePath);
    const sourceFromCwd = toNormalizedAbsolute(cwd, sourcePath);
    const normalizedTarget = normalizePath(targetPath);

    return (
        isSamePath(normalizedSource, normalizedTarget) ||
        isSamePath(sourceFromCwd, normalizedTarget) ||
        normalizedTarget.endsWith(`/${normalizedSource}`)
    );
};
