import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
        expect($group).toHaveClass('nd-disabled-carrier');
        expect($group).not.toHaveClass('disabled');
        expect($label).toHaveAttribute('data-disabled');
        expect($label).toHaveClass('nd-disabled-carrier');
        expect($label).not.toHaveClass('disabled');
        expect(container.querySelector('input[type="checkbox"]')).toBeDisabled();
    });
});
