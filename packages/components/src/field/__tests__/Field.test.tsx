import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Field from '..';
import Input from '../../input';

describe('Field', () => {
    it('renders label, helper, status and required indicator slots', () => {
        render(
            <Field required>
                <Field.Label>Email</Field.Label>
                <Input aria-label="email" />
                <Field.Helper>
                    <span>Use your work address.</span>
                </Field.Helper>
                <Field.Status type="error">
                    <strong>Invalid email.</strong>
                </Field.Status>
            </Field>,
        );

        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('*')).toBeInTheDocument();
        expect(screen.getByText('Use your work address.')).toBeInTheDocument();
        expect(screen.getByText('Invalid email.')).toBeInTheDocument();
        expect(screen.getByText('Invalid email.').closest('.nd-field-status')).toHaveAttribute('data-status', 'error');
    });

    it('renders bare controls directly', () => {
        render(
            <Field>
                <button type="button">Toggle</button>
            </Field>,
        );

        expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
    });

    it('keeps only the first bare control child', () => {
        render(
            <Field>
                <Input aria-label="first" />
                <Input aria-label="second" />
            </Field>,
        );

        expect(screen.getByRole('textbox', { name: 'first' })).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: 'second' })).not.toBeInTheDocument();
    });

    it('does not inject value and onChange props when used outside Form', () => {
        const onChange = vi.fn();

        render(
            <Field name="email">
                <Input aria-label="email" defaultValue="initial" onChange={onChange} />
            </Field>,
        );

        fireEvent.change(screen.getByRole('textbox', { name: 'email' }), { target: { value: 'next' } });

        expect(onChange).toHaveBeenCalledWith('next', expect.any(Object));
        expect(screen.getByRole('textbox', { name: 'email' })).toHaveValue('next');
    });

    it('marks disabled fields with data-disabled and propagates disabled to controls', () => {
        render(
            <Field disabled>
                <Field.Label>Email</Field.Label>
                <Input aria-label="email" />
            </Field>,
        );

        const $field = screen.getByText('Email').closest('.nd-field');
        const input = screen.getByRole('textbox', { name: 'email' });

        expect($field).toHaveAttribute('data-disabled');
        expect(input).toBeDisabled();
    });
});
