const tokenize = text => {
    const segmenter = new Intl.Segmenter(['zh-CN', 'en-US'], { granularity: 'word' });
    const segments = [];
    for (const it of segmenter.segment(text)) {
        if (it.isWordLike) {
            segments.push(it.segment);
        }
    }

    return segments;
};

/**
 * @returns {import('vitepress').DefaultTheme.Config['search']}
 */
const getSearch = () => {
    return {
        provider: 'local',
        options: {
            locales: {
                'zh-CN': {
                    translations: {
                        button: {
                            buttonText: '搜索',
                            buttonAriaLabel: '搜索',
                        },
                    },
                },
            },
            miniSearch: {
                options: {
                    tokenize,
                },
                searchOptions: {
                    prefix: true,
                    combineWith: 'AND',
                    processTerm: tokenize,
                },
            },
        },
    };
};

export default getSearch;
