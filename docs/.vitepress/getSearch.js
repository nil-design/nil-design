import { load } from 'cheerio';
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
                } else if (html.includes('h1')) {
                    const $ = load(html, null, false);
                    const $h1 = $('h1#frontmatter-title');
                    if ($h1.length) {
                        $h1.remove();

                        return `${md.render(`# ${env.frontmatter?.title}`)}${$.html()}`;
                    } else {
                        return html;
                    }
                } else {
                    return `${md.render(`# ${env.frontmatter?.title}`)}${html}`;
                }
            },
        },
    };
};

export default getSearch;
