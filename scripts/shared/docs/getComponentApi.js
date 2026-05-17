import { extractProject } from '@nild/api-extractor';

const getBlockTags = comment => comment?.blockTags ?? [];

const hasBlockTag = (comment, tag, text) => {
    return getBlockTags(comment).some(
        blockTag => blockTag.tag === tag && (text === undefined || blockTag.text === text),
    );
};

const getComponentApi = async ({ entryPoint, tsconfig, fallbackName }) => {
    const project = await extractProject({
        entryPoints: [entryPoint],
        tsconfig,
        filters: {
            includeKinds: ['component'],
        },
    });

    return project.items
        .filter(item => item.kind === 'component')
        .filter(item => hasBlockTag(item.comment, '@category', 'Components'))
        .flatMap(item => [item, ...item.compounds])
        .flatMap(item => {
            const name = item.name === 'default' ? fallbackName : item.name.replace(/^default\./, `${fallbackName}.`);

            if (!item.propsObject) {
                if (
                    !item.propsType ||
                    (item.name.includes('.') &&
                        !['react', '@types/react'].includes(item.propsType.packageName) &&
                        !/^[A-Z][A-Za-z]*HTMLAttributes$/.test(item.propsType.name))
                ) {
                    return [];
                }

                return [
                    {
                        name,
                        equalType:
                            item.propsType.kind === 'union'
                                ? item.propsType.text.replaceAll(/<T>/g, '')
                                : item.propsType.text,
                        props: [],
                    },
                ];
            }

            return [
                {
                    name,
                    extendTypes: item.propsObject.extends.map(type => type.text),
                    props: item.propsObject.properties.map(prop => ({
                        name: prop.name,
                        optional: prop.optional,
                        type: prop.type.text,
                        description:
                            prop.comment?.summary ??
                            prop.comment?.blockTags.find(tag => tag.tag === '@description')?.text ??
                            '',
                        defaultValue: prop.defaultValue ?? '',
                    })),
                },
            ];
        });
};

export default getComponentApi;
