import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Input from '..';

describe('Input', () => {
    it('recognizes custom prefix and suffix slots', () => {
        render(
            <Input aria-label="website">
                <Input.Prefix>https://</Input.Prefix>
                <Input.Suffix>.com</Input.Suffix>
            </Input>,
        );

        expect(screen.getByText('https://')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'website' })).toBeInTheDocument();
        expect(screen.getByText('.com')).toBeInTheDocument();
    });

    it('keeps the last duplicated prefix and suffix slots', () => {
        render(
            <Input aria-label="email">
                <Input.Prefix>First prefix</Input.Prefix>
                <Input.Prefix>Second prefix</Input.Prefix>
                <Input.Suffix>First suffix</Input.Suffix>
                <Input.Suffix>Second suffix</Input.Suffix>
            </Input>,
        );

        expect(screen.queryByText('First prefix')).not.toBeInTheDocument();
        expect(screen.getByText('Second prefix')).toBeInTheDocument();
        expect(screen.queryByText('First suffix')).not.toBeInTheDocument();
        expect(screen.getByText('Second suffix')).toBeInTheDocument();
    });

    it('marks the wrapper with data-disabled and disables the native input', () => {
        render(<Input aria-label="email" disabled />);

        const input = screen.getByRole('textbox', { name: 'email' });
        const $wrapper = input.closest('.nd-input-wrapper');

        expect(input).toBeDisabled();
        expect($wrapper).toHaveAttribute('data-disabled');
        expect($wrapper).toHaveClass('nd-disabled-carrier');
        expect($wrapper).not.toHaveClass('disabled');
    });
});

describe('Input.Composite', () => {
    it('recognizes custom prepend, input, and append slots', () => {
        render(
            <Input.Composite>
                <Input.Prepend>https://</Input.Prepend>
                <Input aria-label="website" />
                <Input.Append>.com</Input.Append>
            </Input.Composite>,
        );

        expect(screen.getByText('https://')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'website' })).toBeInTheDocument();
        expect(screen.getByText('.com')).toBeInTheDocument();
    });

    it('keeps the last duplicated prepend, input, and append slots', () => {
        render(
            <Input.Composite>
                <Input.Prepend>First prepend</Input.Prepend>
                <Input.Prepend>Second prepend</Input.Prepend>
                <Input aria-label="first input" />
                <Input aria-label="second input" />
                <Input.Append>First append</Input.Append>
                <Input.Append>Second append</Input.Append>
            </Input.Composite>,
        );

        expect(screen.queryByText('First prepend')).not.toBeInTheDocument();
        expect(screen.getByText('Second prepend')).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'first input' })).not.toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'second input' })).toBeInTheDocument();
        expect(screen.queryByText('First append')).not.toBeInTheDocument();
        expect(screen.getByText('Second append')).toBeInTheDocument();
    });

    it('returns nothing when no input slot is provided', () => {
        const { container } = render(
            <Input.Composite>
                <Input.Prepend>https://</Input.Prepend>
                <Input.Append>.com</Input.Append>
            </Input.Composite>,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('marks disabled composites with data-disabled and propagates disabled to the input', () => {
        const { container } = render(
            <Input.Composite disabled>
                <Input aria-label="website" />
            </Input.Composite>,
        );

        const $composite = container.querySelector('.nd-input-composite');
        const input = screen.getByRole('textbox', { name: 'website' });

        expect($composite).toHaveAttribute('data-disabled');
        expect($composite).toHaveClass('nd-disabled-carrier');
        expect($composite).not.toHaveClass('disabled');
        expect(input).toBeDisabled();
        expect(input.closest('.nd-input-wrapper')).toHaveAttribute('data-disabled');
    });
});

describe('Input.Number', () => {
    it('disables the composite, input and step buttons when disabled', () => {
        const onChange = vi.fn();

        const { container } = render(
            <Input.Number aria-label="amount" defaultValue={1} disabled onChange={onChange} />,
        );

        const input = screen.getByRole('spinbutton', { name: 'amount' });
        const buttons = screen.getAllByRole('button');
        const $composite = container.querySelector('.nd-input-composite');

        expect($composite).toHaveAttribute('data-disabled');
        expect($composite).toHaveClass('nd-disabled-carrier');
        expect(input).toBeDisabled();
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toBeDisabled();
        expect(buttons[1]).toBeDisabled();

        fireEvent.click(buttons[0]);
        fireEvent.click(buttons[1]);

        expect(onChange).not.toHaveBeenCalled();
    });
});
