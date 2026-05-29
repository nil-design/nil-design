import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Input from '..';
import type { OTPRef } from '../interfaces';

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
        expect(input).toBeDisabled();
        expect(input.closest('.nd-input-wrapper')).toHaveAttribute('data-disabled');
    });
});

describe('Input.Search', () => {
    it('uses default values and reports string changes', () => {
        const onChange = vi.fn();

        render(<Input.Search aria-label="search" defaultValue="initial" onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'search' });

        expect(input).toHaveValue('initial');

        fireEvent.change(input, { target: { value: 'next' } });

        expect(input).toHaveValue('next');
        expect(onChange).toHaveBeenCalledWith('next', expect.any(Object));
    });

    it('keeps keyword controlled by props', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Input.Search aria-label="search" keyword="fixed" onChange={onChange} />);

        const input = screen.getByRole('textbox', { name: 'search' });

        fireEvent.change(input, { target: { value: 'draft' } });

        expect(onChange).toHaveBeenCalledWith('draft', expect.any(Object));
        expect(input).toHaveValue('fixed');

        rerender(<Input.Search aria-label="search" keyword="updated" onChange={onChange} />);

        expect(input).toHaveValue('updated');
    });
});

describe('Input.Password', () => {
    it('toggles native input type and reports visibility changes', () => {
        const onVisibleChange = vi.fn();

        const { container } = render(
            <Input.Password aria-label="password" defaultValue="secret" onVisibleChange={onVisibleChange} />,
        );

        const input = screen.getByDisplayValue('secret');
        const toggle = input.nextElementSibling as HTMLElement;

        expect(input).toHaveAttribute('type', 'password');

        fireEvent.click(toggle);

        expect(input).toHaveAttribute('type', 'text');
        expect(onVisibleChange).toHaveBeenCalledWith(true);
        expect(container).toContainElement(toggle);
    });

    it('keeps visibility controlled by props', () => {
        const onVisibleChange = vi.fn();
        const { rerender } = render(
            <Input.Password aria-label="password" onVisibleChange={onVisibleChange} visible={false} />,
        );

        const input = screen.getByLabelText('password');
        const toggle = input.nextElementSibling as HTMLElement;

        fireEvent.click(toggle);

        expect(onVisibleChange).toHaveBeenCalledWith(true);
        expect(input).toHaveAttribute('type', 'password');

        rerender(<Input.Password aria-label="password" onVisibleChange={onVisibleChange} visible />);

        expect(input).toHaveAttribute('type', 'text');
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
        expect(input).toBeDisabled();
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toBeDisabled();
        expect(buttons[1]).toBeDisabled();

        fireEvent.click(buttons[0]);
        fireEvent.click(buttons[1]);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('steps values within min and max boundaries', () => {
        const onChange = vi.fn();

        render(<Input.Number aria-label="amount" defaultValue={1} max={2} min={0} onChange={onChange} />);

        const input = screen.getByRole('spinbutton', { name: 'amount' });
        const [minus, plus] = screen.getAllByRole('button');

        fireEvent.click(plus);
        fireEvent.click(plus);

        expect(input).toHaveValue(2);
        expect(onChange).toHaveBeenLastCalledWith(2);

        fireEvent.click(minus);
        fireEvent.click(minus);
        fireEvent.click(minus);

        expect(input).toHaveValue(0);
        expect(onChange).toHaveBeenLastCalledWith(0);
    });

    it('converts invalid native input values to undefined', () => {
        const onChange = vi.fn();

        render(<Input.Number aria-label="amount" defaultValue={1} onChange={onChange} />);

        fireEvent.change(screen.getByRole('spinbutton', { name: 'amount' }), { target: { value: '' } });

        expect(onChange).toHaveBeenCalledWith(undefined, expect.any(Object));
    });
});

describe('Input.OTP', () => {
    it('distributes typed characters and reports completion', () => {
        const onChange = vi.fn();
        const onComplete = vi.fn();

        render(<Input.OTP length={3} onChange={onChange} onComplete={onComplete} />);

        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

        fireEvent.change(inputs[0], { target: { value: '12' } });
        fireEvent.change(inputs[2], { target: { value: '3' } });

        expect(inputs.map(input => input.value)).toEqual(['1', '2', '3']);
        expect(onChange).toHaveBeenLastCalledWith(['1', '2', '3'], expect.any(Object));
        expect(onComplete).toHaveBeenCalledWith(['1', '2', '3'], expect.any(Object));
    });

    it('pastes from the focused input and filters numeric otp values', () => {
        const onChange = vi.fn();

        render(<Input.OTP length={4} onChange={onChange} type="number" />);

        const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];

        inputs[0].focus();
        fireEvent.paste(inputs[0], {
            clipboardData: {
                getData: () => 'a12 3',
            },
        });

        expect(inputs.map(input => input.value)).toEqual(['1', '2', '3', '']);
        expect(onChange).toHaveBeenLastCalledWith(['1', '2', '3', ''], expect.any(Object));
    });

    it('handles keyboard deletion', () => {
        render(<Input.OTP defaultValue={['1', '2', '3']} length={3} />);

        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

        inputs[1].focus();
        fireEvent.keyDown(inputs[1], { key: 'Backspace' });

        expect(inputs.map(input => input.value)).toEqual(['1', '', '3']);
        expect(inputs[1]).toHaveFocus();

        fireEvent.keyDown(inputs[1], { key: 'Backspace' });

        expect(inputs.map(input => input.value)).toEqual(['', '', '3']);
        expect(inputs[0]).toHaveFocus();
    });

    it('handles arrow focus movement', () => {
        render(<Input.OTP defaultValue={['1', '2', '3']} length={3} />);

        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

        inputs[0].focus();

        fireEvent.keyDown(inputs[0], { key: 'ArrowRight' });

        expect(inputs[1]).toHaveFocus();

        fireEvent.keyDown(inputs[1], { key: 'ArrowLeft' });

        expect(inputs[0]).toHaveFocus();
    });

    it('exposes focus and blur methods', () => {
        const ref = createRef<OTPRef>();

        render(<Input.OTP defaultValue={['1', '', '3']} length={3} ref={ref} />);

        const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];

        ref.current?.focus();
        expect(inputs[1]).toHaveFocus();

        ref.current?.focus(2);
        expect(inputs[2]).toHaveFocus();

        ref.current?.blur();
        expect(inputs[2]).not.toHaveFocus();
    });
});
