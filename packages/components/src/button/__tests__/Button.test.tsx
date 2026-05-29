import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Button from '..';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>Button</Button>);

        expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('uses native disabled semantics and shared disabled marker without legacy class', () => {
        render(<Button disabled>Button</Button>);

        const button = screen.getByRole('button', { name: 'Button' });

        expect(button).toBeDisabled();
    });

    it('renders nothing for an empty group', () => {
        const { container } = render(<Button.Group />);

        expect(container).toBeEmptyDOMElement();
    });

    it('renders a single grouped button without an extra group wrapper', () => {
        render(
            <Button.Group aria-label="actions">
                <Button>Only action</Button>
            </Button.Group>,
        );

        expect(screen.getByRole('button', { name: 'Only action' })).toBeInTheDocument();
        expect(screen.queryByLabelText('actions')).not.toBeInTheDocument();
    });

    it('keeps only button children in a multi-button group', () => {
        render(
            <Button.Group aria-label="actions">
                ignored text
                <span>Ignored node</span>
                <Button>Save</Button>
                <Button>Cancel</Button>
            </Button.Group>,
        );

        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.queryByText('Ignored node')).not.toBeInTheDocument();
        expect(screen.queryByText('ignored text')).not.toBeInTheDocument();
    });

    it('propagates group disabled state to child buttons', () => {
        render(
            <Button.Group disabled>
                <Button>Save</Button>
                <Button>Cancel</Button>
            </Button.Group>,
        );

        expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    });
});
