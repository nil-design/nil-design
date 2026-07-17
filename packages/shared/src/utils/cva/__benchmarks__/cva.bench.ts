import { bench, describe } from 'vitest';
import cva from '../index';

const variants = cva<{ disabled?: boolean; size?: 'small' | 'medium' | 'large'; variant?: 'solid' | 'outlined' }>(
    'inline-flex items-center',
    {
        variants: {
            disabled: { true: 'opacity-50', false: '' },
            size: { small: 'h-6', medium: 'h-8', large: 'h-10' },
            variant: { solid: 'bg-brand', outlined: 'border border-brand' },
        },
        compoundVariants: [{ size: ['medium', 'large'], variant: 'solid', className: 'font-medium' }],
        defaultVariants: { disabled: false, size: 'medium', variant: 'solid' },
    },
);

describe('cva', () => {
    bench('resolves variants and compound variants', () => {
        variants({ disabled: false, size: 'large', variant: 'solid' });
    });
});
