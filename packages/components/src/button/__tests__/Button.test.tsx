import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Button from '../Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Button</Button>);

        expect(screen.getByText('Button')).toBeInTheDocument();
    });
});
