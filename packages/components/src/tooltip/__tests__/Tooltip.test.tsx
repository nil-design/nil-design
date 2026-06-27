import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Tooltip from '..';
import { Tooltip as RootTooltip } from '../../index';

vi.mock('@floating-ui/dom', () => ({
    autoUpdate: vi.fn(() => vi.fn()),
    computePosition: vi.fn(() =>
        Promise.resolve({
            x: 0,
            y: 0,
            placement: 'top',
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

describe('Tooltip', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('is exported from the package root', () => {
        expect(RootTooltip).toBe(Tooltip);
    });

    it('opens and closes on hover by default', async () => {
        const onClose = vi.fn();
        const onOpen = vi.fn();

        render(
            <Tooltip delay={0} onClose={onClose} onOpen={onOpen}>
                <Tooltip.Trigger>
                    <button type="button">Hover target</button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <div>Tooltip content</div>
                </Tooltip.Portal>
            </Tooltip>,
        );

        fireEvent.mouseEnter(screen.getByRole('button', { name: 'Hover target' }));

        await waitFor(() => expect(screen.getByText('Tooltip content')).toBeInTheDocument());
        expect(onOpen).toHaveBeenCalledTimes(1);

        fireEvent.mouseLeave(screen.getByRole('button', { name: 'Hover target' }));

        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    });

    it('keeps hover as its default trigger action', async () => {
        render(
            <Tooltip delay={0}>
                <Tooltip.Trigger>
                    <button type="button">Click target</button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <div>Hover tooltip</div>
                </Tooltip.Portal>
            </Tooltip>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Click target' }));
        expect(screen.queryByText('Hover tooltip')).not.toBeInTheDocument();

        fireEvent.mouseEnter(screen.getByRole('button', { name: 'Click target' }));

        await waitFor(() => expect(screen.getByText('Hover tooltip')).toBeInTheDocument());
    });

    it('opens on focus and closes on blur', async () => {
        const onClose = vi.fn();
        const onOpen = vi.fn();

        render(
            <Tooltip delay={0} onClose={onClose} onOpen={onOpen}>
                <Tooltip.Trigger>
                    <button type="button">Focus target</button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <div>Focus tooltip</div>
                </Tooltip.Portal>
            </Tooltip>,
        );

        fireEvent.focus(screen.getByRole('button', { name: 'Focus target' }));

        await waitFor(() => expect(screen.getByText('Focus tooltip')).toBeInTheDocument());
        expect(onOpen).toHaveBeenCalledTimes(1);

        fireEvent.blur(screen.getByRole('button', { name: 'Focus target' }));

        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    });

    it('stays open while either focus or hover is active', async () => {
        const onClose = vi.fn();

        render(
            <Tooltip delay={0} onClose={onClose}>
                <Tooltip.Trigger>
                    <button type="button">Mixed target</button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <div>Mixed tooltip</div>
                </Tooltip.Portal>
            </Tooltip>,
        );

        const target = screen.getByRole('button', { name: 'Mixed target' });

        fireEvent.focus(target);
        await waitFor(() => expect(screen.getByText('Mixed tooltip')).toBeInTheDocument());

        fireEvent.mouseEnter(target);
        fireEvent.blur(target);

        expect(onClose).not.toHaveBeenCalled();

        fireEvent.mouseLeave(target);

        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    });

    it('does not open when disabled', async () => {
        render(
            <Tooltip delay={0} disabled>
                <Tooltip.Trigger>
                    <button type="button">Disabled tooltip</button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <div>Disabled tooltip content</div>
                </Tooltip.Portal>
            </Tooltip>,
        );

        fireEvent.mouseEnter(screen.getByRole('button', { name: 'Disabled tooltip' }));

        await waitFor(() => expect(screen.queryByText('Disabled tooltip content')).not.toBeInTheDocument());
    });
});
