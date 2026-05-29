import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from '..';

describe('Checkbox', () => {
    it('renders plain text children as the label content', () => {
        render(<Checkbox>Accept terms</Checkbox>);

        expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('supports custom indicator and label slots', () => {
        const { container } = render(
            <Checkbox>
                <Checkbox.Indicator>{checked => <span>{checked ? 'Checked' : 'Unchecked'}</span>}</Checkbox.Indicator>
                <Checkbox.Label>{checked => (checked ? 'Enabled' : 'Disabled')}</Checkbox.Label>
            </Checkbox>,
        );

        expect(screen.getByText('Unchecked')).toBeInTheDocument();
        expect(screen.getByText('Disabled')).toBeInTheDocument();

        fireEvent.click(container.querySelector('input[type="checkbox"]')!);

        expect(screen.getByText('Checked')).toBeInTheDocument();
        expect(screen.getByText('Enabled')).toBeInTheDocument();
    });

    it('keeps the last duplicated label slot', () => {
        render(
            <Checkbox>
                <Checkbox.Label>First label</Checkbox.Label>
                <Checkbox.Label>Second label</Checkbox.Label>
            </Checkbox>,
        );

        expect(screen.queryByText('First label')).not.toBeInTheDocument();
        expect(screen.getByText('Second label')).toBeInTheDocument();
    });

    it('injects the default indicator when no explicit indicator is provided', () => {
        const { container } = render(<Checkbox>Choice</Checkbox>);

        expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    });

    it('disables the hidden native input when the checkbox is disabled', () => {
        const { container } = render(<Checkbox disabled>Choice</Checkbox>);

        expect(container.querySelector('input[type="checkbox"]')).toBeDisabled();
    });

    it('marks disabled labels and groups with data-disabled instead of legacy class', () => {
        const { container } = render(
            <Checkbox.Group disabled>
                <Checkbox value="choice">Choice</Checkbox>
            </Checkbox.Group>,
        );

        const $group = container.querySelector('.nd-checkbox-group');
        const $label = screen.getByText('Choice').closest('label');

        expect($group).toHaveAttribute('data-disabled');
        expect($label).toHaveAttribute('data-disabled');
        expect(container.querySelector('input[type="checkbox"]')).toBeDisabled();
    });

    it('updates uncontrolled group values and reports the full selection', () => {
        const onChange = vi.fn();

        render(
            <Checkbox.Group defaultValue={['apple']} onChange={onChange}>
                <Checkbox value="apple">Apple</Checkbox>
                <Checkbox value="banana">Banana</Checkbox>
            </Checkbox.Group>,
        );

        const apple = screen.getByRole('checkbox', { name: 'Apple' });
        const banana = screen.getByRole('checkbox', { name: 'Banana' });

        expect(apple).toBeChecked();
        expect(banana).not.toBeChecked();

        fireEvent.click(banana);

        expect(banana).toBeChecked();
        expect(onChange).toHaveBeenLastCalledWith(['apple', 'banana']);

        fireEvent.click(apple);

        expect(apple).not.toBeChecked();
        expect(onChange).toHaveBeenLastCalledWith(['banana']);
    });

    it('supports controlled group values', () => {
        const onChange = vi.fn();
        const Demo = () => {
            const [value, setValue] = useState(['apple']);

            return (
                <Checkbox.Group
                    value={value}
                    onChange={nextValue => {
                        onChange(nextValue);
                        setValue(nextValue);
                    }}
                >
                    <Checkbox value="apple">Apple</Checkbox>
                    <Checkbox value="banana">Banana</Checkbox>
                </Checkbox.Group>
            );
        };

        render(<Demo />);

        fireEvent.click(screen.getByRole('checkbox', { name: 'Banana' }));

        expect(screen.getByRole('checkbox', { name: 'Banana' })).toBeChecked();
        expect(onChange).toHaveBeenCalledWith(['apple', 'banana']);
    });
});
