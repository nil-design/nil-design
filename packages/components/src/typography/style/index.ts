import { cva } from '@nild/shared';
import { DISABLED_CLS } from '../../_shared/style';
import { LinkProps, ParagraphProps, TextProps, TextTag, TitleProps, TypographyProps } from '../interfaces';

export const linkClassNames = cva<LinkProps>(
    [
        'nd-link',
        [
            'font-nd',
            'text-link',
            'text-[length:inherit]',
            'cursor-pointer',
            'enabled:hover:text-link-hover',
            'enabled:active:text-link-active',
        ],
        DISABLED_CLS,
    ],
    {
        variants: {
            disabled: {
                true: 'disabled',
                false: '',
            },
            underlined: {
                true: 'underline',
                false: 'no-underline',
            },
        },
    },
);

export const paragraphClassNames = cva<ParagraphProps>([
    'nd-paragraph',
    ['font-nd', 'text-primary', 'text-[length:inherit]'],
    ['mt-0', 'mb-[1em]'],
]);

export const textClassNames = cva<TextProps>(['nd-text', ['font-nd', 'text-[length:inherit]'], DISABLED_CLS], {
    variants: {
        secondary: {
            true: 'text-secondary',
            false: 'text-primary',
        },
        disabled: {
            true: 'disabled',
            false: '',
        },
    },
});

export const textTagClassNames = cva<{ tag: TextTag }>('', {
    variants: {
        tag: {
            strong: '',
            del: '',
            u: ['underline'],
            i: '',
            mark: ['bg-primary', 'text-contrast'],
            code: [
                ['ps-1.5', 'pe-1.5'],
                ['bg-secondary', 'text-sm', 'rounded-sm'],
                ['border', 'border-solid', 'border-secondary'],
            ],
            kbd: [
                ['ps-1.5', 'pe-1.5'],
                ['text-sm', 'rounded-sm'],
                ['border', 'border-b-2', 'border-solid', 'border-secondary'],
            ],
        },
    },
});

export const titleClassNames = cva<TitleProps>(
    ['nd-title', ['font-nd', 'font-semibold', 'text-primary'], ['mt-[1em]', 'mb-[0.5em]']],
    {
        variants: {
            level: {
                1: ['text-6xl'],
                2: ['text-5xl'],
                3: ['text-4xl'],
                4: ['text-3xl'],
                5: ['text-2xl'],
                6: ['text-lg'],
            },
        },
    },
);

export const typographyClassNames = cva<TypographyProps>(['nd-typography', ['font-nd', 'text-md']]);
