import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Radio from '..';

describe('Radio', () => {
    it('renders plain text children as the label content', () => {
        render(<Radio>Accept terms</Radio>);

        expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('supports custom indicator and label slots', () => {
        const { container } = render(
            <Radio>
                <Radio.Indicator>{checked => <span>{checked ? 'Checked' : 'Unchecked'}</span>}</Radio.Indicator>
                <Radio.Label>{checked => (checked ? 'Enabled' : 'Disabled')}</Radio.Label>
            </Radio>,
        );

        expect(screen.getByText('Unchecked')).toBeInTheDocument();
        expect(screen.getByText('Disabled')).toBeInTheDocument();

        fireEvent.click(container.querySelector('input[type="radio"]')!);

        expect(screen.getByText('Checked')).toBeInTheDocument();
        expect(screen.getByText('Enabled')).toBeInTheDocument();
    });

    it('keeps the last duplicated label slot', () => {
        render(
            <Radio>
                <Radio.Label>First label</Radio.Label>
                <Radio.Label>Second label</Radio.Label>
            </Radio>,
        );

        expect(screen.queryByText('First label')).not.toBeInTheDocument();
        expect(screen.getByText('Second label')).toBeInTheDocument();
    });

    it('keeps the last duplicated indicator slot', () => {
        render(
            <Radio>
                <Radio.Indicator>{() => <span>First indicator</span>}</Radio.Indicator>
                <Radio.Indicator>{() => <span>Second indicator</span>}</Radio.Indicator>
            </Radio>,
        );

        expect(screen.queryByText('First indicator')).not.toBeInTheDocument();
        expect(screen.getByText('Second indicator')).toBeInTheDocument();
    });

    it('injects the default indicator when no explicit indicator is provided', () => {
        const { container } = render(<Radio>Choice</Radio>);

        expect(container.querySelector('input[type="radio"]')).toBeInTheDocument();
    });

    it('keeps the explicit label before the explicit indicator when declared first', () => {
        const { container } = render(
            <Radio>
                <Radio.Label>Label first</Radio.Label>
                <Radio.Indicator>{() => <span>Indicator second</span>}</Radio.Indicator>
            </Radio>,
        );

        const $root = container.querySelector('label');

        expect($root?.firstElementChild).toHaveTextContent('Label first');
        expect($root?.lastElementChild).toHaveTextContent('Indicator second');
    });

    it('disables the hidden native input when the radio is disabled', () => {
        const { container } = render(<Radio disabled>Choice</Radio>);

        expect(container.querySelector('input[type="radio"]')).toBeDisabled();
    });

    it('marks disabled labels and groups with data-disabled instead of legacy class', () => {
        const { container } = render(
            <Radio.Group disabled>
                <Radio value="choice">Choice</Radio>
            </Radio.Group>,
        );

        const $group = container.querySelector('.nd-radio-group');
        const $label = screen.getByText('Choice').closest('label');

        expect($group).toHaveAttribute('data-disabled');
        expect($label).toHaveAttribute('data-disabled');
        expect(container.querySelector('input[type="radio"]')).toBeDisabled();
    });

    it('updates uncontrolled group values and ignores repeated selections', () => {
        const onChange = vi.fn();

        render(
            <Radio.Group defaultValue="apple" onChange={onChange}>
                <Radio value="apple">Apple</Radio>
                <Radio value="banana">Banana</Radio>
            </Radio.Group>,
        );

        const apple = screen.getByRole('radio', { name: 'Apple' });
        const banana = screen.getByRole('radio', { name: 'Banana' });

        expect(apple).toBeChecked();
        expect(banana).not.toBeChecked();

        fireEvent.click(banana);
        fireEvent.click(banana);

        expect(banana).toBeChecked();
        expect(apple).not.toBeChecked();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('banana');
    });

    it('supports controlled group values', () => {
        const onChange = vi.fn();
        const Demo = () => {
            const [value, setValue] = useState('apple');

            return (
                <Radio.Group
                    value={value}
                    onChange={nextValue => {
                        onChange(nextValue);
                        setValue(nextValue);
                    }}
                >
                    <Radio value="apple">Apple</Radio>
                    <Radio value="banana">Banana</Radio>
                </Radio.Group>
            );
        };

        render(<Demo />);

        fireEvent.click(screen.getByRole('radio', { name: 'Banana' }));

        expect(screen.getByRole('radio', { name: 'Banana' })).toBeChecked();
        expect(onChange).toHaveBeenCalledWith('banana');
    });
});
