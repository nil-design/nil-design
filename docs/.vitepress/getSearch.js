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
            /**
             * @link https://github.com/vuejs/vitepress/issues/3024
             * @link https://github.com/vuejs/vitepress/pull/2770
             */
            _render: (src, env, md) => {
                const html = md.render(src, env);
                if (env.frontmatter?.search === false) {
                    return '';
                } else {
                    return html.replace(/\{\{\s*\$frontmatter\.([a-zA-Z_$][\w$]*)\s*\}\}/g, (match, key) => {
                        return env.frontmatter?.[key] || match;
                    });
                }
            },
        },
    };
};

export default getSearch;
