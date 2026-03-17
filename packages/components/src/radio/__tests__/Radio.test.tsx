import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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

        const root = container.querySelector('label');

        expect(root?.firstElementChild).toHaveTextContent('Label first');
        expect(root?.lastElementChild).toHaveTextContent('Indicator second');
    });

    it('disables the hidden native input when the radio is disabled', () => {
        const { container } = render(<Radio disabled>Choice</Radio>);

        expect(container.querySelector('input[type="radio"]')).toBeDisabled();
    });
});
