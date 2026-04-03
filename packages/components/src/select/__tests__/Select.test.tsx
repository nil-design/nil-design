import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Select from '..';
import { Select as RootSelect } from '../../index';

vi.mock('@floating-ui/dom', () => ({
    autoUpdate: vi.fn(() => vi.fn()),
    computePosition: vi.fn(() =>
        Promise.resolve({
            x: 0,
            y: 0,
            placement: 'bottom-start',
            middlewareData: {
                arrow: { x: 0, y: 0 },
            },
        }),
    ),
    offset: vi.fn(() => ({ name: 'offset' })),
    shift: vi.fn(() => ({ name: 'shift' })),
    flip: vi.fn(() => ({ name: 'flip' })),
    arrow: vi.fn(() => ({ name: 'arrow' })),
}));

const renderOptions = () => (
    <>
        <Select.Option value="beijing" label="Beijing" />
        <Select.Option value="shanghai" label="Shanghai" />
        <Select.Option value="shenzhen" label="Shenzhen" />
    </>
);

describe('Select', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
            callback(0);

            return 0;
        });
        vi.stubGlobal('cancelAnimationFrame', vi.fn());
        Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
            configurable: true,
            value: vi.fn(),
        });
    });

    it('is exported from the package root', () => {
        expect(RootSelect).toBe(Select);
    });

    it('renders placeholders and default values', () => {
        render(
            <>
                <Select aria-label="single" defaultValue="shanghai">
                    {renderOptions()}
                </Select>
                <Select aria-label="multi" defaultValue={['beijing', 'shenzhen']} multiple>
                    {renderOptions()}
                </Select>
                <Select aria-label="placeholder" placeholder="Select a city">
                    {renderOptions()}
                </Select>
            </>,
        );

        expect(screen.getByRole('button', { name: 'single' })).toHaveTextContent('Shanghai');
        expect(screen.getByRole('button', { name: 'multi' })).toHaveTextContent('Beijing, Shenzhen');
        expect(screen.getByRole('button', { name: 'placeholder' })).toHaveTextContent('Select a city');
    });

    it('applies pointer cursor and brand indicator classes', () => {
        render(
            <Select aria-label="city" defaultValue="shanghai">
                {renderOptions()}
            </Select>,
        );

        const trigger = screen.getByRole('button', { name: 'city' });

        expect(trigger).toHaveClass('cursor-pointer');

        fireEvent.click(trigger);

        const indicator = screen
            .getByRole('option', { name: 'Shanghai' })
            .querySelector('.nd-select-option-indicator') as HTMLElement | null;
        const icon = indicator?.querySelector('.text-brand') as HTMLElement | null;
        const path = indicator?.querySelector('path') as SVGPathElement | null;

        expect(indicator).not.toBeNull();
        expect(icon).not.toBeNull();
        expect(path).not.toBeNull();
        expect(path).toHaveAttribute('stroke', 'currentColor');
    });

    it('collects fragment options in render order', () => {
        render(
            <Select aria-label="cities" defaultValue={['shenzhen', 'beijing']} multiple>
                <>
                    <Select.Option value="beijing" label="Beijing" />
                    <>
                        <Select.Option value="shanghai" label="Shanghai" />
                    </>
                </>
                <Select.Option value="shenzhen" label="Shenzhen" />
            </Select>,
        );

        expect(screen.getByRole('button', { name: 'cities' })).toHaveTextContent('Beijing, Shenzhen');
    });

    it('renders custom option content while keeping label-based summaries', () => {
        render(
            <Select aria-label="city" defaultValue="shanghai">
                <Select.Option value="beijing" label="Beijing" />
                <Select.Option value="shanghai" label="Shanghai">
                    <div data-testid="custom-option">
                        <strong>Shanghai</strong>
                        <span> / 涓婃捣</span>
                    </div>
                </Select.Option>
            </Select>,
        );

        const trigger = screen.getByRole('button', { name: 'city' });

        expect(trigger).toHaveTextContent('Shanghai');

        fireEvent.click(trigger);

        const option = screen.getByRole('option', { name: 'Shanghai / 涓婃捣' });

        expect(within(option).getByTestId('custom-option')).toBeInTheDocument();
        expect(option.querySelector('.nd-select-option-indicator')).not.toBeNull();
    });

    it('supports uncontrolled single selection and closes after clicking an option', () => {
        render(
            <Select aria-label="city" placeholder="Select a city">
                <Select.Option value="beijing" label="Beijing" />
                <Select.Option value="shanghai" label="Shanghai">
                    Shanghai / 上海
                </Select.Option>
                <Select.Option value="shenzhen" label="Shenzhen" />
            </Select>,
        );

        const trigger = screen.getByRole('button', { name: 'city' });

        fireEvent.click(trigger);

        expect(screen.getByRole('listbox')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('option', { name: 'Shanghai / 上海' }));

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveFocus();
        expect(trigger).toHaveTextContent('Shanghai');
    });

    it('supports controlled single selection and keyboard navigation', () => {
        const Demo = () => {
            const [value, setValue] = useState<string | undefined>('shanghai');

            return (
                <Select aria-label="city" value={value} onChange={nextValue => setValue(nextValue)}>
                    <Select.Option value="beijing" label="Beijing" />
                    <Select.Option value="hangzhou" disabled label="Hangzhou" />
                    <Select.Option value="shanghai" label="Shanghai" />
                    <Select.Option value="shenzhen" label="Shenzhen" />
                </Select>
            );
        };

        render(<Demo />);

        const trigger = screen.getByRole('button', { name: 'city' });

        fireEvent.keyDown(trigger, { key: 'ArrowDown' });

        const listbox = screen.getByRole('listbox');
        const options = screen.getAllByRole('option');

        expect(listbox).toHaveAttribute('aria-activedescendant', options[2].id);

        fireEvent.keyDown(listbox, { key: 'Home' });
        expect(listbox).toHaveAttribute('aria-activedescendant', options[0].id);

        fireEvent.keyDown(listbox, { key: 'End' });
        expect(listbox).toHaveAttribute('aria-activedescendant', options[3].id);

        fireEvent.keyDown(listbox, { key: 'ArrowUp' });
        expect(listbox).toHaveAttribute('aria-activedescendant', options[2].id);

        fireEvent.keyDown(listbox, { key: 'ArrowDown' });
        expect(listbox).toHaveAttribute('aria-activedescendant', options[3].id);

        fireEvent.keyDown(listbox, { key: ' ' });

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveFocus();
        expect(trigger).toHaveTextContent('Shenzhen');
    });

    it('keeps keyboard navigation working when focus is still on the trigger after opening', () => {
        render(
            <Select aria-label="city" placeholder="Select a city">
                {renderOptions()}
            </Select>,
        );

        const trigger = screen.getByRole('button', { name: 'city' });

        fireEvent.click(trigger);

        const listbox = screen.getByRole('listbox');
        const shanghai = screen.getByRole('option', { name: 'Shanghai' });

        expect(listbox).toHaveFocus();

        trigger.focus();
        fireEvent.keyDown(trigger, { key: 'ArrowDown' });

        expect(listbox).toHaveAttribute('aria-activedescendant', shanghai.id);

        fireEvent.keyDown(trigger, { key: 'Enter' });

        expect(trigger).toHaveTextContent('Shanghai');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('supports controlled multi selection and keeps the listbox open after selecting', () => {
        const Demo = () => {
            const [value, setValue] = useState(['beijing']);

            return (
                <Select<string> aria-label="cities" multiple value={value} onChange={nextValue => setValue(nextValue)}>
                    {renderOptions()}
                </Select>
            );
        };

        render(<Demo />);

        const trigger = screen.getByRole('button', { name: 'cities' });

        expect(trigger).toHaveTextContent('Beijing');

        fireEvent.click(trigger);
        fireEvent.click(screen.getByRole('option', { name: 'Shanghai' }));

        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(trigger).toHaveTextContent('Beijing, Shanghai');
        expect(screen.getByRole('option', { name: 'Shanghai' }).querySelector('.text-brand')).not.toBeNull();

        fireEvent.click(screen.getByRole('option', { name: 'Beijing' }));

        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(trigger).toHaveTextContent('Shanghai');
    });

    it('keeps the keyboard active option after toggling multiple selection', () => {
        const Demo = () => {
            const [value, setValue] = useState(['beijing']);

            return (
                <Select<string> aria-label="cities" multiple value={value} onChange={nextValue => setValue(nextValue)}>
                    {renderOptions()}
                </Select>
            );
        };

        render(<Demo />);

        const trigger = screen.getByRole('button', { name: 'cities' });

        fireEvent.keyDown(trigger, { key: 'ArrowDown' });

        const listbox = screen.getByRole('listbox');

        fireEvent.keyDown(listbox, { key: 'ArrowDown' });

        const shanghai = screen.getByRole('option', { name: 'Shanghai' });

        expect(listbox).toHaveAttribute('aria-activedescendant', shanghai.id);

        fireEvent.keyDown(listbox, { key: ' ' });

        expect(screen.getByRole('listbox')).toHaveAttribute('aria-activedescendant', shanghai.id);
        expect(shanghai).toHaveClass('bg-muted');
        expect(shanghai).toHaveClass('hover:bg-muted-hover');
        expect(trigger).toHaveTextContent('Beijing, Shanghai');
    });

    it('prevents disabled triggers and disabled options from changing state', () => {
        const onChange = vi.fn();

        render(
            <>
                <Select aria-label="disabled-select" disabled>
                    {renderOptions()}
                </Select>
                <Select aria-label="city" onChange={onChange}>
                    <Select.Option value="beijing" disabled label="Beijing" />
                    <Select.Option value="shanghai" label="Shanghai" />
                </Select>
            </>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'disabled-select' }));
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'city' }));
        fireEvent.click(screen.getByRole('option', { name: 'Beijing' }));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('supports escape, tab and outside-click closing behaviors', () => {
        render(
            <>
                <button type="button">Outside</button>
                <Select aria-label="city">{renderOptions()}</Select>
            </>,
        );

        const trigger = screen.getByRole('button', { name: 'city' });

        fireEvent.click(trigger);
        fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveFocus();

        fireEvent.click(trigger);
        fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Tab' });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(trigger);
        fireEvent.click(document.body);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not open when there are no selectable options', () => {
        render(<Select aria-label="empty" placeholder="Nothing to select" />);

        const trigger = screen.getByRole('button', { name: 'empty' });

        fireEvent.click(trigger);
        fireEvent.keyDown(trigger, { key: 'ArrowDown' });

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
});
