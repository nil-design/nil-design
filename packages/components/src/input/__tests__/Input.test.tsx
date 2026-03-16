import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
