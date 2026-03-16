import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Switch from '..';

describe('Switch', () => {
    it('recognizes custom track and thumb slots', () => {
        render(
            <Switch>
                <Switch.Track type="checked">
                    <span data-testid="checked-track">On track</span>
                </Switch.Track>
                <Switch.Track type="unchecked">
                    <span data-testid="unchecked-track">Off track</span>
                </Switch.Track>
                <Switch.Thumb>{checked => <span>{checked ? 'On' : 'Off'}</span>}</Switch.Thumb>
            </Switch>,
        );

        expect(screen.getByTestId('checked-track')).toBeInTheDocument();
        expect(screen.getByTestId('unchecked-track')).toBeInTheDocument();
        expect(screen.getByText('Off')).toBeInTheDocument();
    });

    it('keeps the last duplicated checked track slot', () => {
        render(
            <Switch>
                <Switch.Track type="checked">First checked</Switch.Track>
                <Switch.Track type="checked">Second checked</Switch.Track>
            </Switch>,
        );

        expect(screen.queryByText('First checked')).not.toBeInTheDocument();
        expect(screen.getByText('Second checked')).toBeInTheDocument();
    });

    it('toggles the thumb content after click', () => {
        render(
            <Switch>
                <Switch.Thumb>{checked => <span>{checked ? 'On' : 'Off'}</span>}</Switch.Thumb>
            </Switch>,
        );

        fireEvent.click(screen.getByRole('switch'));

        expect(screen.getByText('On')).toBeInTheDocument();
    });

    it('calls onChange with the next checked state', () => {
        const onChange = vi.fn();

        render(
            <Switch onChange={onChange}>
                <Switch.Thumb>{checked => <span>{checked ? 'On' : 'Off'}</span>}</Switch.Thumb>
            </Switch>,
        );

        fireEvent.click(screen.getByRole('switch'));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(true);
        expect(screen.getByText('On')).toBeInTheDocument();
    });
});
