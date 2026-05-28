import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Button from '../Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Button</Button>);

        expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('uses native disabled semantics and shared disabled marker without legacy class', () => {
        render(<Button disabled>Button</Button>);

        const button = screen.getByRole('button', { name: 'Button' });

        expect(button).toBeDisabled();
        expect(button).toHaveClass('nd-disabled-carrier');
        expect(button).not.toHaveClass('disabled');
    });
});
