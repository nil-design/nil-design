import { ReferenceReflection, ReflectionKind } from 'typedoc';
import { sourceMatchesPath, toRelative } from '../_shared/path';
import { readPackageName } from './entryPoints';
import { serializeSource } from './serializers/comment';
import { isDeclarationReflection } from './typedocGuards';
import type { ApiDiagnostic, ApiEntryPoint, ApiProject } from '../interfaces';
import type { DeclarationReflection, ProjectReflection, Reflection } from 'typedoc';

export interface ExportDeclaration {
    reflection: DeclarationReflection;
    exportReflection: DeclarationReflection;
}

export const createEmptyProject = (cwd: string, entryPoints: string[], diagnostics: ApiDiagnostic[]): ApiProject => {
    return {
        schemaVersion: '1.0',
        packageName: readPackageName(cwd),
        entryPoints: entryPoints.map<ApiEntryPoint>(entryPoint => ({
            path: toRelative(cwd, entryPoint),
        })),
        items: [],
        diagnostics,
    };
};

const isEntryPointModule = (reflection: Reflection) => {
    return reflection.kind === ReflectionKind.Module && isDeclarationReflection(reflection);
};

const findEntryPointForSource = (sourceFileName: string | undefined, cwd: string, entryPoints: string[]) => {
    if (!sourceFileName) return undefined;

    return entryPoints.find(entryPoint => sourceMatchesPath(sourceFileName, entryPoint, cwd));
};

export const getEntryPointByReflection = (project: ProjectReflection, cwd: string, entryPoints: string[]) => {
    const fallbackEntryPoint = entryPoints[0] ? toRelative(cwd, entryPoints[0]) : '';
    const map = new Map<number, string>();

    const visit = (reflection: Reflection, inheritedEntryPoint?: string) => {
        const source = serializeSource(reflection);
        const matchedEntryPoint = findEntryPointForSource(source?.fileName, cwd, entryPoints);
        const entryPoint = matchedEntryPoint
            ? toRelative(cwd, matchedEntryPoint)
            : (inheritedEntryPoint ?? fallbackEntryPoint);

        map.set(reflection.id, entryPoint);

        for (const child of isDeclarationReflection(reflection) ? (reflection.children ?? []) : []) {
            visit(child, entryPoint);
        }
    };

    for (const child of project.children ?? []) {
        visit(child);
    }

    return map;
};

const resolveExportDeclaration = (reflection: Reflection): ExportDeclaration | undefined => {
    if (reflection instanceof ReferenceReflection) {
        const target = reflection.tryGetTargetReflectionDeep();

        return isDeclarationReflection(target)
            ? {
                  reflection: target,
                  exportReflection: reflection,
              }
            : undefined;
    }

    return isDeclarationReflection(reflection)
        ? {
              reflection,
              exportReflection: reflection,
          }
        : undefined;
};

export const getExportDeclarations = (project: ProjectReflection): ExportDeclaration[] => {
    return (project.children ?? [])
        .flatMap(child => (isEntryPointModule(child) ? (child.children ?? []) : [child]))
        .map(resolveExportDeclaration)
        .filter((declaration): declaration is ExportDeclaration => !!declaration);
};
