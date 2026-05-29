import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Popover from '..';
import { Popover as RootPopover } from '../../index';

vi.mock('@floating-ui/dom', () => ({
    autoUpdate: vi.fn(() => vi.fn()),
    computePosition: vi.fn(() =>
        Promise.resolve({
            x: 0,
            y: 0,
            placement: 'bottom',
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

describe('Popover', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('is exported from the package root', () => {
        expect(RootPopover).toBe(Popover);
    });

    it('opens slotted portal content from its trigger', async () => {
        render(
            <Popover>
                <Popover.Trigger>
                    <button type="button">Open popover</button>
                </Popover.Trigger>
                <Popover.Portal>
                    <div>Popover content</div>
                </Popover.Portal>
            </Popover>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Open popover' }));

        await waitFor(() => {
            expect(screen.getByText('Popover content')).toBeInTheDocument();
        });
    });

    it('renders default-open content and reports open and close changes', async () => {
        const onOpen = vi.fn();
        const onClose = vi.fn();

        render(
            <Popover onClose={onClose} onOpen={onOpen}>
                <Popover.Trigger>
                    <button type="button">Toggle popover</button>
                </Popover.Trigger>
                <Popover.Portal>
                    <div>Controlled content</div>
                </Popover.Portal>
            </Popover>,
        );

        const trigger = screen.getByRole('button', { name: 'Toggle popover' });

        fireEvent.click(trigger);
        await waitFor(() => expect(screen.getByText('Controlled content')).toBeInTheDocument());

        fireEvent.click(document.body);
        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

        expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('does not open when disabled', async () => {
        render(
            <Popover disabled>
                <Popover.Trigger>
                    <button type="button">Disabled popover</button>
                </Popover.Trigger>
                <Popover.Portal>
                    <div>Disabled content</div>
                </Popover.Portal>
            </Popover>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Disabled popover' }));

        await waitFor(() => expect(screen.queryByText('Disabled content')).not.toBeInTheDocument());
    });

    it('renders default-open content', () => {
        render(
            <Popover defaultOpen>
                <Popover.Trigger>
                    <button type="button">Default trigger</button>
                </Popover.Trigger>
                <Popover.Portal>
                    <div>Default content</div>
                </Popover.Portal>
            </Popover>,
        );

        expect(screen.getByText('Default content')).toBeInTheDocument();
    });
});
