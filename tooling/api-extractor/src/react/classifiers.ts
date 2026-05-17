import { hasBlockTag } from '../_shared/tags';
import { analyzeReactComponentTypes, findCompoundComponentReflections, isComponentName, isHookName } from './index';
import type { ApiFunctionItem, ApiProject, ExtractProjectOptions } from '../interfaces';
import type { RawReactComponentTypes } from './index';
import type { DeclarationReflection } from 'typedoc';

interface AnalyzedCompoundComponent {
    reflection: DeclarationReflection;
    reactTypes: RawReactComponentTypes;
}

const hasReactTypes = (compound: {
    reflection: DeclarationReflection;
    reactTypes: RawReactComponentTypes | undefined;
}): compound is AnalyzedCompoundComponent => !!compound.reactTypes;

export class ReactAnalyzer {
    private readonly componentCache = new WeakMap<DeclarationReflection, RawReactComponentTypes | null>();
    private readonly compoundCache = new WeakMap<DeclarationReflection, AnalyzedCompoundComponent[]>();

    constructor(private readonly options: ExtractProjectOptions) {}

    getComponentTypes(reflection: DeclarationReflection): RawReactComponentTypes | undefined {
        const cached = this.componentCache.get(reflection);

        if (cached !== undefined) return cached ?? undefined;

        const reactTypes = analyzeReactComponentTypes(reflection, this.options.reactComponents);

        this.componentCache.set(reflection, reactTypes ?? null);

        return reactTypes;
    }

    getComponentClassification(
        reflection: DeclarationReflection,
        item: Pick<ApiFunctionItem, 'name' | 'comment'>,
    ): RawReactComponentTypes | undefined {
        const reactTypes = this.getComponentTypes(reflection);
        const namedComponent = isComponentName(item.name, this.options.reactComponents);
        const taggedComponent = hasBlockTag(item.comment, '@category', 'Components');

        return reactTypes && (namedComponent || taggedComponent) ? reactTypes : undefined;
    }

    getCompoundComponents(reflection: DeclarationReflection) {
        const cached = this.compoundCache.get(reflection);

        if (cached) return cached;

        const compounds = findCompoundComponentReflections(reflection)
            .map(compoundReflection => ({
                reflection: compoundReflection,
                reactTypes: this.getComponentTypes(compoundReflection),
            }))
            .filter(hasReactTypes);

        this.compoundCache.set(reflection, compounds);

        return compounds;
    }

    shouldClassifyAsHook(item: ApiFunctionItem, project: ApiProject) {
        return (
            isHookName(item.name, this.options.reactComponents) ||
            this.options.reactComponents?.customHookClassifiers?.some(classifier =>
                classifier({
                    item,
                    project: {
                        ...project,
                        items: [item],
                    },
                }),
            )
        );
    }
}
