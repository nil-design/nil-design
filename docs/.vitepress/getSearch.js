import i18n from '../../locales/index.js';

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
                            buttonText: i18n.t('search'),
                            buttonAriaLabel: i18n.t('search'),
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
