import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Splitter from '..';
import { Splitter as RootSplitter } from '../../index';

const mockRect = ($element: HTMLElement, rect: Partial<DOMRect>) => {
    $element.getBoundingClientRect = vi.fn(() => ({
        bottom: 100,
        height: 100,
        left: 0,
        right: 200,
        top: 0,
        width: 200,
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

describe('Splitter', () => {
    it('is exported from the package root', () => {
        expect(RootSplitter).toBe(Splitter);
        expect(RootSplitter.Panel).toBe(Splitter.Panel);
        expect(RootSplitter.Grip).toBe(Splitter.Grip);
    });

    it('renders panels with default percentage sizes', () => {
        render(
            <Splitter aria-label="layout">
                <Splitter.Panel>Left</Splitter.Panel>
                <Splitter.Panel>Right</Splitter.Panel>
            </Splitter>,
        );

        expect(screen.getByText('Left')).toHaveStyle({ flexBasis: '50%' });
        expect(screen.getByText('Right')).toHaveStyle({ flexBasis: '50%' });
        expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
        expect(screen.getByRole('separator')).toHaveAttribute('aria-valuenow', '50');
        expect(screen.getByRole('separator')).toHaveStyle({ left: '50%' });
    });

    it('positions multiple resizers from accumulated panel sizes', () => {
        render(
            <Splitter aria-label="layout" defaultSize={[20, 30, 50]}>
                <Splitter.Panel>Left</Splitter.Panel>
                <Splitter.Panel>Middle</Splitter.Panel>
                <Splitter.Panel>Right</Splitter.Panel>
            </Splitter>,
        );

        const separators = screen.getAllByRole('separator');

        expect(separators[0]).toHaveStyle({ left: '20%' });
        expect(separators[1]).toHaveStyle({ left: '50%' });
    });

    it('supports uncontrolled pointer resizing and resize callbacks', () => {
        const onResize = vi.fn();
        const onResizeStart = vi.fn();
        const onResizeEnd = vi.fn();

        render(
            <Splitter
                aria-label="layout"
                defaultSize={[30, 70]}
                onResize={onResize}
                onResizeEnd={onResizeEnd}
                onResizeStart={onResizeStart}
            >
                <Splitter.Panel>Left</Splitter.Panel>
                <Splitter.Panel>Right</Splitter.Panel>
            </Splitter>,
        );

        const splitter = screen.getByLabelText('layout');
        const separator = screen.getByRole('separator');

        mockRect(splitter, { left: 0, width: 200 });
        firePointerEvent(separator, 'pointerdown', { button: 0, clientX: 60 });

        expect(onResizeStart).toHaveBeenLastCalledWith([30, 70], 0);

        firePointerEvent(window, 'pointermove', { clientX: 100 });
        expect(screen.getByText('Left')).toHaveStyle({ flexBasis: '50%' });
        expect(onResize).toHaveBeenLastCalledWith([50, 50]);

        firePointerEvent(window, 'pointerup', { clientX: 120 });
        expect(screen.getByText('Left')).toHaveStyle({ flexBasis: '60%' });
        expect(onResizeEnd).toHaveBeenLastCalledWith([60, 40], 0);
    });

    it('supports controlled sizes', () => {
        const onResize = vi.fn();

        const Demo = () => {
            const [size, setSize] = useState([25, 75]);

            return (
                <Splitter
                    aria-label="layout"
                    size={size}
                    onResize={nextSize => {
                        onResize(nextSize);
                        setSize(nextSize);
                    }}
                >
                    <Splitter.Panel>Left</Splitter.Panel>
                    <Splitter.Panel>Right</Splitter.Panel>
                </Splitter>
            );
        };

        render(<Demo />);

        const splitter = screen.getByLabelText('layout');
        const separator = screen.getByRole('separator');

        mockRect(splitter, { left: 0, width: 100 });
        firePointerEvent(separator, 'pointerdown', { button: 0, clientX: 25 });
        firePointerEvent(window, 'pointermove', { clientX: 40 });

        expect(onResize).toHaveBeenLastCalledWith([40, 60]);
        expect(screen.getByText('Left')).toHaveStyle({ flexBasis: '40%' });
    });

    it('respects min and max bounds while resizing', () => {
        render(
            <Splitter aria-label="layout" defaultSize={[50, 50]}>
                <Splitter.Panel min={30} max={60}>
                    Left
                </Splitter.Panel>
                <Splitter.Panel min={20}>Right</Splitter.Panel>
            </Splitter>,
        );

        const splitter = screen.getByLabelText('layout');
        const separator = screen.getByRole('separator');

        mockRect(splitter, { left: 0, width: 100 });
        firePointerEvent(separator, 'pointerdown', { button: 0, clientX: 50 });
        firePointerEvent(window, 'pointermove', { clientX: 100 });

        expect(screen.getByText('Left')).toHaveStyle({ flexBasis: '60%' });

        firePointerEvent(window, 'pointermove', { clientX: 0 });

        expect(screen.getByText('Left')).toHaveStyle({ flexBasis: '30%' });
    });

    it('supports keyboard resizing for vertical splitters', () => {
        const onResizeEnd = vi.fn();

        render(
            <Splitter
                aria-label="layout"
                defaultSize={[50, 50]}
                keyboardResizeStep={10}
                orientation="vertical"
                onResizeEnd={onResizeEnd}
            >
                <Splitter.Panel>Top</Splitter.Panel>
                <Splitter.Panel>Bottom</Splitter.Panel>
            </Splitter>,
        );

        const separator = screen.getByRole('separator');

        expect(separator).toHaveAttribute('aria-orientation', 'horizontal');

        fireEvent.keyDown(separator, { key: 'ArrowDown' });
        expect(screen.getByText('Top')).toHaveStyle({ flexBasis: '60%' });

        fireEvent.keyDown(separator, { key: 'Home' });
        expect(screen.getByText('Top')).toHaveStyle({ flexBasis: '0%' });
        expect(onResizeEnd).toHaveBeenLastCalledWith([0, 100], 0);
    });

    it('resizes a focused separator by keyboard without resize callbacks', () => {
        render(
            <Splitter aria-label="layout" defaultSize={[50, 50]}>
                <Splitter.Panel>Left</Splitter.Panel>
                <Splitter.Panel>Right</Splitter.Panel>
            </Splitter>,
        );

        const separator = screen.getByRole('separator');

        separator.focus();
        fireEvent.keyDown(separator, { key: 'ArrowRight' });

        expect(separator).toHaveFocus();
        expect(screen.getByText('Left')).toHaveStyle({ flexBasis: '55%' });
    });

    it('supports custom and self-closing grip slots', () => {
        const { rerender } = render(
            <Splitter aria-label="layout">
                <Splitter.Panel>Left</Splitter.Panel>
                <Splitter.Grip>
                    <span data-testid="custom-grip">::</span>
                </Splitter.Grip>
                <Splitter.Panel>Right</Splitter.Panel>
            </Splitter>,
        );

        expect(screen.getByTestId('custom-grip')).toBeInTheDocument();

        rerender(
            <Splitter aria-label="layout">
                <Splitter.Panel>Left</Splitter.Panel>
                <Splitter.Grip />
                <Splitter.Panel>Right</Splitter.Panel>
            </Splitter>,
        );

        expect(screen.getByRole('separator').querySelector('.nd-splitter-grip')).toBeInTheDocument();
        expect(screen.queryByTestId('custom-grip')).not.toBeInTheDocument();
    });

    it('exposes custom double click handling when default reset is disabled', () => {
        const onDoubleClick = vi.fn();

        render(
            <Splitter
                aria-label="layout"
                defaultSize={[35, 65]}
                onDoubleClick={onDoubleClick}
                resetOnDoubleClick={false}
            >
                <Splitter.Panel>Left</Splitter.Panel>
                <Splitter.Panel>Right</Splitter.Panel>
            </Splitter>,
        );

        fireEvent.doubleClick(screen.getByRole('separator'));

        expect(onDoubleClick.mock.calls[0][0]).toEqual([35, 65]);
        expect(onDoubleClick.mock.calls[0][1]).toBe(0);
        expect(screen.getByText('Left')).toHaveStyle({ flexBasis: '35%' });
    });

    it('does not resize when disabled', () => {
        const onResize = vi.fn();

        render(
            <Splitter aria-label="layout" defaultSize={[30, 70]} disabled onResize={onResize}>
                <Splitter.Panel>Left</Splitter.Panel>
                <Splitter.Panel>Right</Splitter.Panel>
            </Splitter>,
        );

        const splitter = screen.getByLabelText('layout');
        const separator = screen.getByRole('separator');

        mockRect(splitter, { left: 0, width: 100 });
        firePointerEvent(separator, 'pointerdown', { button: 0, clientX: 30 });
        firePointerEvent(window, 'pointermove', { clientX: 80 });
        fireEvent.keyDown(separator, { key: 'ArrowRight' });

        expect(separator).toHaveAttribute('aria-disabled', 'true');
        expect(separator.querySelector('.nd-splitter-grip')).not.toBeInTheDocument();
        expect(screen.getByText('Left')).toHaveStyle({ flexBasis: '30%' });
        expect(onResize).not.toHaveBeenCalled();
    });
});
