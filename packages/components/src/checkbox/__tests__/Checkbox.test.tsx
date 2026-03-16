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
});
