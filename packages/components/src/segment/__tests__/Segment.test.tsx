import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Segment from '..';
import { Segment as RootSegment } from '../../index';

const renderItems = () => (
    <>
        <Segment.Item value="day">Day</Segment.Item>
        <Segment.Item value="month">Month</Segment.Item>
        <Segment.Item value="year">Year</Segment.Item>
    </>
);

describe('Segment', () => {
    beforeEach(() => {
        vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
            callback(0);

            return 0;
        });
    });

    it('is exported from the package root', () => {
        expect(RootSegment).toBe(Segment);
    });

    it('selects the first enabled item by default and collects fragment items in order', () => {
        render(
            <Segment>
                <Segment.Item value="disabled" disabled>
                    Disabled
                </Segment.Item>
                <>
                    <Segment.Item value="day">Day</Segment.Item>
                </>
                <Segment.Item value="month">Month</Segment.Item>
            </Segment>,
        );

        const items = screen.getAllByRole('radio');

        expect(items[0]).toHaveTextContent('Disabled');
        expect(items[0]).toHaveAttribute('aria-checked', 'false');
        expect(items[1]).toHaveAttribute('aria-checked', 'true');
        expect(items[2]).toHaveAttribute('aria-checked', 'false');
    });

    it('supports controlled values and ignores repeated selections', () => {
        const onChange = vi.fn();
        const Demo = () => {
            const [value, setValue] = useState('day');

            return (
                <Segment
                    value={value}
                    onChange={nextValue => {
                        onChange(nextValue);
                        setValue(nextValue);
                    }}
                >
                    {renderItems()}
                </Segment>
            );
        };

        render(<Demo />);

        const month = screen.getByRole('radio', { name: 'Month' });

        fireEvent.click(month);
        fireEvent.click(month);

        expect(month).toHaveAttribute('aria-checked', 'true');
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('month');
    });

    it('does not change value when root or item is disabled', () => {
        const onChange = vi.fn();
        const { rerender } = render(
            <Segment defaultValue="day" disabled onChange={onChange}>
                {renderItems()}
            </Segment>,
        );

        fireEvent.click(screen.getByRole('radio', { name: 'Month' }));
        fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' });

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('radio', { name: 'Month' })).toBeDisabled();

        rerender(
            <Segment defaultValue="day" onChange={onChange}>
                <Segment.Item value="day">Day</Segment.Item>
                <Segment.Item value="month" disabled>
                    Month
                </Segment.Item>
            </Segment>,
        );

        fireEvent.click(screen.getByRole('radio', { name: 'Month' }));

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves selection with horizontal arrows and skips disabled items', () => {
        render(
            <Segment defaultValue="day">
                <Segment.Item value="day">Day</Segment.Item>
                <Segment.Item value="month" disabled>
                    Month
                </Segment.Item>
                <Segment.Item value="year">Year</Segment.Item>
            </Segment>,
        );

        const group = screen.getByRole('radiogroup');
        const year = screen.getByRole('radio', { name: 'Year' });

        fireEvent.keyDown(group, { key: 'ArrowRight' });

        expect(year).toHaveAttribute('aria-checked', 'true');
        expect(year).toHaveFocus();

        fireEvent.keyDown(group, { key: 'ArrowLeft' });

        expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
    });

    it('supports Home, End and vertical arrow navigation', () => {
        render(
            <Segment defaultValue="month" orientation="vertical">
                {renderItems()}
            </Segment>,
        );

        const group = screen.getByRole('radiogroup');

        expect(group).toHaveAttribute('aria-orientation', 'vertical');

        fireEvent.keyDown(group, { key: 'End' });
        expect(screen.getByRole('radio', { name: 'Year' })).toHaveAttribute('aria-checked', 'true');

        fireEvent.keyDown(group, { key: 'ArrowUp' });
        expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-checked', 'true');

        fireEvent.keyDown(group, { key: 'Home' });
        expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
    });

    it('selects the focused item with Enter or Space', () => {
        const { rerender } = render(<Segment defaultValue="day">{renderItems()}</Segment>);

        const group = screen.getByRole('radiogroup');
        const year = screen.getByRole('radio', { name: 'Year' });

        fireEvent.focus(year);
        fireEvent.keyDown(group, { key: 'Enter' });

        expect(year).toHaveAttribute('aria-checked', 'true');

        rerender(<Segment defaultValue="day">{renderItems()}</Segment>);

        const month = screen.getByRole('radio', { name: 'Month' });

        fireEvent.focus(month);
        fireEvent.keyDown(screen.getByRole('radiogroup'), { key: ' ' });

        expect(month).toHaveAttribute('aria-checked', 'true');
    });

    it('applies size, orientation, block, selected and disabled classes', () => {
        render(
            <Segment block defaultValue="day" size="large">
                <Segment.Item value="day">Day</Segment.Item>
                <Segment.Item value="month" disabled>
                    Month
                </Segment.Item>
            </Segment>,
        );

        const group = screen.getByRole('radiogroup');
        const selected = screen.getByRole('radio', { name: 'Day' });
        const disabled = screen.getByRole('radio', { name: 'Month' });
        const $indicator = group.querySelector('.nd-segment-indicator');

        expect(group).toHaveClass('w-full');
        expect(group).toHaveAttribute('aria-orientation', 'horizontal');
        expect($indicator).toBeInTheDocument();
        expect($indicator).toHaveClass('transition-[transform,width,height,opacity]');
        expect(selected).toHaveClass('text-brand');
        expect(selected).toHaveClass('text-lg');
        expect(selected).toHaveClass('flex-1');
        expect(disabled).toHaveClass('cursor-not-allowed');
    });
});
