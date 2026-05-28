import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Form from '..';
import Button from '../../button';
import Checkbox from '../../checkbox';
import Field from '../../field';
import Input from '../../input';
import Switch from '../../switch';
import type { FormResolver } from '../interfaces';

interface SameValueControlProps {
    value?: unknown;
    onChange?: (value: unknown) => void;
}

const SameValueControl = ({ value, onChange }: SameValueControlProps) => {
    return (
        <button type="button" onClick={() => onChange?.(value)}>
            Keep value
        </button>
    );
};

describe('Form', () => {
    it('injects default value through string paths and reports the whole value on changes', () => {
        const onChange = vi.fn();

        render(
            <Form defaultValue={{ user: { email: 'old@example.com' } }} onChange={onChange}>
                <Field name="user.email">
                    <Input aria-label="email" />
                </Field>
            </Form>,
        );

        const input = screen.getByRole('textbox', { name: 'email' });

        expect(input).toHaveValue('old@example.com');

        fireEvent.change(input, { target: { value: 'new@example.com' } });

        expect(onChange).toHaveBeenCalledWith({ user: { email: 'new@example.com' } });
        expect(input).toHaveValue('new@example.com');
    });

    it('forwards ref to the form element', () => {
        const ref = createRef<HTMLFormElement>();

        render(
            <Form ref={ref}>
                <Field name="email">
                    <Input aria-label="email" />
                </Field>
            </Form>,
        );

        expect(ref.current).toBeInstanceOf(HTMLFormElement);
    });

    it('binds checked controls with bind', () => {
        render(
            <Form defaultValue={{ accepted: false, enabled: false }}>
                <Field name="accepted" bind="checked">
                    <Checkbox>
                        <Checkbox.Label>Accepted</Checkbox.Label>
                    </Checkbox>
                </Field>
                <Field name="enabled" bind="checked">
                    <Switch aria-label="enabled" />
                </Field>
            </Form>,
        );

        const checkbox = screen.getByRole('checkbox', { name: 'Accepted' });
        const toggle = screen.getByRole('switch', { name: 'enabled' });

        expect(checkbox).not.toBeChecked();
        expect(toggle).toHaveAttribute('aria-checked', 'false');

        fireEvent.click(checkbox);
        fireEvent.click(toggle);

        expect(checkbox).toBeChecked();
        expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('filters non-field children and renders actions', () => {
        const children = (
            <>
                ignored text
                <Field name="email">
                    <Input aria-label="email" />
                </Field>
                <div>Invalid child</div>
                <Field name="name">
                    <Input aria-label="name" />
                </Field>
                <Form.Actions>
                    <Button type="submit">Submit</Button>
                </Form.Actions>
            </>
        );

        render(<Form>{children}</Form>);

        expect(screen.getByRole('textbox', { name: 'email' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'name' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        expect(screen.queryByText('Invalid child')).not.toBeInTheDocument();
        expect(screen.queryByText('ignored text')).not.toBeInTheDocument();
    });

    it('does not update form value or validate when a field emits the same value', () => {
        const onChange = vi.fn();
        const resolver = vi.fn<FormResolver>().mockReturnValue({ errors: {} });

        render(
            <Form defaultValue={{ email: 'same@example.com' }} resolver={resolver} onChange={onChange}>
                <Field name="email">
                    <SameValueControl />
                </Field>
            </Form>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Keep value' }));

        expect(onChange).not.toHaveBeenCalled();
        expect(resolver).not.toHaveBeenCalled();
    });

    it('blocks submit when resolver returns errors and displays the issue', async () => {
        const onSubmit = vi.fn();
        const onInvalid = vi.fn();
        const resolver: FormResolver = value => ({
            errors: value.email ? {} : { email: 'Email is required.' },
        });

        render(
            <Form resolver={resolver} onInvalid={onInvalid} onSubmit={onSubmit}>
                <Field name="email">
                    <Field.Label>Email</Field.Label>
                    <Input aria-label="email" />
                </Field>
                <Form.Actions>
                    <Button type="submit">Submit</Button>
                </Form.Actions>
            </Form>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => expect(onInvalid).toHaveBeenCalled());

        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByText('Email is required.')).toBeInTheDocument();
        expect(screen.getByText('Email').closest('.nd-field')).toHaveAttribute('data-status', 'error');
    });

    it('runs change validation and lets an empty Field.Status show the resolver issue', async () => {
        const resolver: FormResolver = value => ({
            errors: String(value.email ?? '').includes('@') ? {} : { email: 'Email is invalid.' },
        });

        render(
            <Form resolver={resolver}>
                <Field name="email">
                    <Field.Label>Email</Field.Label>
                    <Input aria-label="email" />
                    <Field.Status />
                </Field>
            </Form>,
        );

        fireEvent.change(screen.getByRole('textbox', { name: 'email' }), { target: { value: 'invalid' } });

        await waitFor(() => expect(screen.getByText('Email is invalid.')).toBeInTheDocument());

        expect(screen.getByText('Email').closest('.nd-field')).toHaveAttribute('data-status', 'error');
    });

    it('lets Field.Status type and custom children override resolver issues', async () => {
        const onInvalid = vi.fn();
        const resolver: FormResolver = () => ({
            errors: { email: 'Resolver issue.' },
        });

        render(
            <Form resolver={resolver} onInvalid={onInvalid}>
                <Field name="email">
                    <Field.Label>Email</Field.Label>
                    <Input aria-label="email" />
                    <Field.Status type="success">
                        <span>Custom status content.</span>
                    </Field.Status>
                </Field>
                <Form.Actions>
                    <Button type="submit">Submit</Button>
                </Form.Actions>
            </Form>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => expect(onInvalid).toHaveBeenCalled());

        expect(screen.getByText('Custom status content.')).toBeInTheDocument();
        expect(screen.queryByText('Resolver issue.')).not.toBeInTheDocument();
        expect(screen.getByText('Email').closest('.nd-field')).toHaveAttribute('data-status', 'success');
    });

    it('shows warnings without blocking submit', async () => {
        const onSubmit = vi.fn();
        const resolver: FormResolver = () => ({
            warnings: { email: { message: <span>Looks unusual.</span> } },
        });

        render(
            <Form defaultValue={{ email: 'name@example.com' }} resolver={resolver} onSubmit={onSubmit}>
                <Field name="email">
                    <Field.Label>Email</Field.Label>
                    <Input aria-label="email" />
                </Field>
                <Form.Actions>
                    <Button type="submit">Submit</Button>
                </Form.Actions>
            </Form>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: 'name@example.com' }, expect.any(Object)));

        expect(screen.getByText('Looks unusual.')).toBeInTheDocument();
        expect(screen.getByText('Email').closest('.nd-field')).toHaveAttribute('data-status', 'warning');
    });

    it('keeps the latest async resolver result', async () => {
        const resolver = vi
            .fn<FormResolver>()
            .mockImplementationOnce(
                () =>
                    new Promise(resolve => {
                        setTimeout(() => resolve({ errors: { email: 'Old error.' } }), 20);
                    }),
            )
            .mockResolvedValueOnce({ errors: {} });

        render(
            <Form resolver={resolver}>
                <Field name="email">
                    <Field.Label>Email</Field.Label>
                    <Input aria-label="email" />
                </Field>
            </Form>,
        );

        const input = screen.getByRole('textbox', { name: 'email' });

        fireEvent.change(input, { target: { value: 'first' } });
        fireEvent.change(input, { target: { value: 'second' } });

        await waitFor(() => expect(resolver).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(screen.queryByText('Old error.')).not.toBeInTheDocument());
    });

    it('marks disabled forms and descendant fields with data-disabled', () => {
        const { container } = render(
            <Form disabled>
                <Field name="email">
                    <Field.Label>Email</Field.Label>
                    <Input aria-label="email" />
                </Field>
                <Field>
                    <Button>Action</Button>
                </Field>
            </Form>,
        );

        const $form = container.querySelector('.nd-form');
        const fields = container.querySelectorAll('.nd-field');
        const input = screen.getByRole('textbox', { name: 'email' });
        const button = screen.getByRole('button', { name: 'Action' });

        expect($form).toHaveAttribute('data-disabled');
        expect($form).toHaveClass('nd-disabled-carrier');
        expect($form).not.toHaveClass('disabled');
        expect(fields[0]).toHaveAttribute('data-disabled');
        expect(fields[1]).toHaveAttribute('data-disabled');
        expect(input).toBeDisabled();
        expect(button).toBeDisabled();
        expect(button).toHaveClass('nd-disabled-carrier');
    });
});
