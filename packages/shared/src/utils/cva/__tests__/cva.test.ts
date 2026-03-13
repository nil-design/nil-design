import { describe, expect, it } from 'vitest';
import cva from '../index';

interface ButtonProps {
    size?: 'sm' | 'lg';
    tone?: 'primary' | 'danger';
    disabled?: boolean;
    level?: 0 | 1;
}

const button = cva<ButtonProps>('btn', {
    variants: {
        size: {
            sm: 'text-sm',
            lg: 'text-lg',
        },
        tone: {
            primary: 'text-blue-500',
            danger: 'text-red-500',
        },
        disabled: {
            true: 'opacity-50',
            false: 'opacity-100',
        },
        level: {
            0: 'z-0',
            1: 'z-10',
        },
    },
    defaultVariants: {
        size: 'sm',
        tone: 'primary',
        disabled: false,
        level: 0,
    },
    compoundVariants: [
        {
            tone: 'danger',
            disabled: true,
            className: 'cursor-not-allowed',
        },
        {
            size: ['sm', 'lg'],
            level: 1,
            className: 'relative',
        },
    ],
});

describe('cva', () => {
    it('should apply base classes with default variants', () => {
        expect(button()).toBe('btn text-sm text-blue-500 opacity-100 z-0');
    });

    it('should override default variants and resolve compound variants', () => {
        expect(button({ tone: 'danger', disabled: true })).toBe(
            'btn text-sm text-red-500 opacity-50 z-0 cursor-not-allowed',
        );
    });

    it('should support falsy variant keys such as boolean false and number 0', () => {
        expect(button({ size: 'lg', level: 1 })).toBe('btn text-lg text-blue-500 opacity-100 z-10 relative');
    });
});
