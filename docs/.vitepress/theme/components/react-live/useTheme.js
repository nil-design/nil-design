import { useMemo } from 'react';

const useTheme = (dark = false) => {
    return useMemo(
        () => ({
            plain: {
                color: dark ? '#E1E4E8' : '#24292E',
                backgroundColor: 'var(--vp-code-block-bg)',
                fontFamily: 'var(--vp-font-family-mono)',
                fontSize: '14px',
                lineHeight: 'var(--vp-code-line-height)',
            },
            styles: [
                {
                    types: [
                        'class-name',
                        'builtin',
                        'entity',
                        'url',
                        'symbol',
                        'number',
                        'boolean',
                        'variable',
                        'constant',
                        'property',
                        'regex',
                        'inserted',
                    ],
                    style: {
                        color: dark ? '#79B8FF' : '#005CC5',
                    },
                },
                {
                    types: ['comment', 'prolog', 'doctype', 'cdata'],
                    style: {
                        color: '#6A737D',
                    },
                },
                {
                    types: ['string', 'attr-value'],
                    style: {
                        color: dark ? '#9ECBFF' : '#032F62',
                    },
                },
                {
                    types: ['punctuation', 'plain-text'],
                    style: {
                        color: dark ? '#E1E4E8' : '#24292E',
                    },
                },
                {
                    types: ['atrule', 'keyword', 'attr-name', 'attr-equals', 'operator'],
                    style: {
                        color: dark ? '#F97583' : '#D73A49',
                    },
                },
                {
                    types: ['function', 'maybe-class-name', 'attr-name', 'deleted', 'tag', 'selector'],
                    style: {
                        color: dark ? '#B392F0' : '#6F42C1',
                    },
                },
            ],
        }),
        [dark],
    );
};

export default useTheme;
