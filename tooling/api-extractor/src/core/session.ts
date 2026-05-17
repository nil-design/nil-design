import { ReactAnalyzer } from '../react/classifiers';
import { convertProject } from './bootstrap';
import { collectEntryPoints } from './entryPoints';
import { applyTransforms, createUnknownExportDiagnostic, isMatchingFilters } from './pipeline';
import { createEmptyProject, getEntryPointByReflection, getExportDeclarations } from './project';
import { resolveExtractProjectOptions } from './resolveOptions';
import { ReflectionSerializer } from './serializers/declaration';
import { createSerializerContext } from './serializers/itemBase';
import { TypeSerializer } from './serializers/type';
import type { ApiProject, ExtractProjectOptions } from '../interfaces';

export class ExtractionSession {
    private readonly options: ExtractProjectOptions;

    constructor(options: ExtractProjectOptions) {
        this.options = resolveExtractProjectOptions(options);
    }

    async extract(): Promise<ApiProject> {
        const { cwd, diagnostics, existingEntryPoints } = collectEntryPoints(this.options);
        const apiProject = createEmptyProject(cwd, existingEntryPoints, diagnostics);

        if (existingEntryPoints.length === 0) return apiProject;

        const convertedProject = await convertProject(existingEntryPoints, this.options);

        if (!convertedProject) {
            return {
                ...apiProject,
                diagnostics: apiProject.diagnostics.concat({
                    code: 'project-convert-failed',
                    message: 'Could not convert the provided entry points.',
                    severity: 'error',
                }),
            };
        }

        const typeSerializer = new TypeSerializer(createSerializerContext(this.options));
        const reactAnalyzer = new ReactAnalyzer(this.options);
        const reflectionSerializer = new ReflectionSerializer({
            options: this.options,
            cwd,
            project: apiProject,
            entryPointByReflection: getEntryPointByReflection(convertedProject, cwd, existingEntryPoints),
            typeSerializer,
            reactAnalyzer,
        });
        const rawItems = getExportDeclarations(convertedProject).map(exportDeclaration =>
            reflectionSerializer.serializeDeclaration(exportDeclaration),
        );
        const diagnosticsWithUnknownExports = rawItems
            .map(item => createUnknownExportDiagnostic(item, this.options))
            .filter((diagnostic): diagnostic is NonNullable<typeof diagnostic> => !!diagnostic);
        const filteredItems = rawItems.filter(item => isMatchingFilters(item, this.options.filters));
        const transformedProject = {
            ...apiProject,
            items: filteredItems,
            diagnostics: apiProject.diagnostics.concat(diagnosticsWithUnknownExports),
        };

        return {
            ...transformedProject,
            items: applyTransforms(transformedProject, this.options),
        };
    }
}
