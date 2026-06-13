import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Slider from '..';
import Field from '../../field';
import Form from '../../form';
import { Slider as RootSlider } from '../../index';

const mockRect = ($element: HTMLElement, rect: Partial<DOMRect>) => {
    $element.getBoundingClientRect = vi.fn(() => ({
        bottom: 20,
        height: 20,
        left: 0,
        right: 100,
        top: 0,
        width: 100,
        x: 0,
        y: 0,
        toJSON: () => ({}),
        ...rect,
    }));
};

const firePointerEvent = (target: EventTarget, type: string, init: MouseEventInit) => {
    act(() => {
        target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, ...init }));
    });
};

describe('Slider', () => {
    it('is exported from the package root', () => {
        expect(RootSlider).toBe(Slider);
        expect(RootSlider.Track).toBe(Slider.Track);
        expect(RootSlider.Range).toBe(Slider.Range);
        expect(RootSlider.Thumb).toBe(Slider.Thumb);
    });

    it('renders default aria values and clamps defaultValue into range', () => {
        render(<Slider aria-label="volume" defaultValue={150} max={100} />);

        const slider = screen.getByRole('slider', { name: 'volume' });

        expect(slider).toHaveAttribute('aria-valuemin', '0');
        expect(slider).toHaveAttribute('aria-valuemax', '100');
        expect(slider).toHaveAttribute('aria-valuenow', '100');
        expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('supports custom slot content and class names', () => {
        const { container } = render(
            <Slider aria-label="volume" defaultValue={40}>
                <Slider.Track className="custom-track">
                    <Slider.Range className="custom-range" />
                </Slider.Track>
                <Slider.Thumb className="custom-thumb">40</Slider.Thumb>
            </Slider>,
        );

        expect(container.querySelector('.custom-track .custom-range')).toBeInTheDocument();
        expect(screen.getByText('40')).toHaveClass('custom-thumb');
    });

    it('supports uncontrolled pointer changes and calls onComplete on release', () => {
        const onChange = vi.fn();
        const onComplete = vi.fn();

        render(<Slider aria-label="volume" onChange={onChange} onComplete={onComplete} />);

        const slider = screen.getByRole('slider', { name: 'volume' });

        mockRect(slider, { left: 0, width: 200 });

        firePointerEvent(slider, 'pointerdown', { button: 0, clientX: 50 });

        expect(slider).toHaveAttribute('aria-valuenow', '25');
        expect(onChange).toHaveBeenLastCalledWith(25);

        firePointerEvent(window, 'pointermove', { clientX: 100 });
        expect(slider).toHaveAttribute('aria-valuenow', '50');

        firePointerEvent(window, 'pointerup', { clientX: 150 });
        expect(slider).toHaveAttribute('aria-valuenow', '75');
        expect(onComplete).toHaveBeenLastCalledWith(75);
    });

    it('supports controlled values', () => {
        const onChange = vi.fn();

        const Demo = () => {
            const [value, setValue] = useState(20);

            return (
                <Slider
                    aria-label="volume"
                    value={value}
                    onChange={nextValue => {
                        onChange(nextValue);
                        setValue(nextValue);
                    }}
                />
            );
        };

        render(<Demo />);

        const slider = screen.getByRole('slider', { name: 'volume' });

        mockRect(slider, { left: 0, width: 100 });

        firePointerEvent(slider, 'pointerdown', { button: 0, clientX: 80 });

        expect(onChange).toHaveBeenCalledWith(80);
        expect(slider).toHaveAttribute('aria-valuenow', '80');
    });

    it('snaps to step values and handles keyboard movement', () => {
        const onComplete = vi.fn();

        render(<Slider aria-label="volume" defaultValue={5} max={20} step={5} onComplete={onComplete} />);

        const slider = screen.getByRole('slider', { name: 'volume' });

        fireEvent.keyDown(slider, { key: 'ArrowRight' });
        expect(slider).toHaveAttribute('aria-valuenow', '10');

        fireEvent.keyDown(slider, { key: 'PageUp' });
        expect(slider).toHaveAttribute('aria-valuenow', '20');

        fireEvent.keyDown(slider, { key: 'ArrowLeft' });
        expect(slider).toHaveAttribute('aria-valuenow', '15');

        fireEvent.keyDown(slider, { key: 'Home' });
        expect(slider).toHaveAttribute('aria-valuenow', '0');

        fireEvent.keyDown(slider, { key: 'End' });
        expect(slider).toHaveAttribute('aria-valuenow', '20');
        expect(onComplete).toHaveBeenLastCalledWith(20);
    });

    it('maps vertical pointer movement from bottom to top', () => {
        render(<Slider aria-label="height" defaultValue={0} orientation="vertical" />);

        const slider = screen.getByRole('slider', { name: 'height' });

        mockRect(slider, { bottom: 100, height: 100, top: 0 });

        firePointerEvent(slider, 'pointerdown', { button: 0, clientY: 25 });

        expect(slider).toHaveAttribute('aria-orientation', 'vertical');
        expect(slider).toHaveAttribute('aria-valuenow', '75');
    });

    it('does not update when disabled', () => {
        const onChange = vi.fn();

        render(<Slider aria-label="volume" defaultValue={30} disabled onChange={onChange} />);

        const slider = screen.getByRole('slider', { name: 'volume' });

        mockRect(slider, { left: 0, width: 100 });

        firePointerEvent(slider, 'pointerdown', { button: 0, clientX: 80 });
        fireEvent.keyDown(slider, { key: 'End' });

        expect(slider).toHaveAttribute('aria-disabled', 'true');
        expect(slider).toHaveAttribute('aria-valuenow', '30');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('feeds Field form binding through the first onChange argument', () => {
        const onChange = vi.fn();

        render(
            <Form defaultValue={{ volume: 20 }} onChange={onChange}>
                <Field name="volume">
                    <Slider aria-label="volume" />
                </Field>
            </Form>,
        );

        const slider = screen.getByRole('slider', { name: 'volume' });

        expect(slider).toHaveAttribute('aria-valuenow', '20');

        mockRect(slider, { left: 0, width: 100 });
        firePointerEvent(slider, 'pointerdown', { button: 0, clientX: 70 });

        expect(onChange).toHaveBeenLastCalledWith({ volume: 70 });
    });
});
