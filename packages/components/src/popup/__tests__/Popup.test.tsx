import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Popup from '..';

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

describe('Popup', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('recognizes explicit trigger and portal slots', () => {
        render(
            <Popup defaultOpen>
                <Popup.Trigger>
                    <button type="button">Explicit trigger</button>
                </Popup.Trigger>
                <Popup.Portal>
                    <div>Explicit portal</div>
                </Popup.Portal>
            </Popup>,
        );

        expect(screen.getByRole('button', { name: 'Explicit trigger' })).toBeInTheDocument();
        expect(screen.getByText('Explicit portal')).toBeInTheDocument();
    });

    it('keeps the last duplicated trigger and portal slots', () => {
        render(
            <Popup defaultOpen>
                <Popup.Trigger>
                    <button type="button">First trigger</button>
                </Popup.Trigger>
                <Popup.Trigger>
                    <button type="button">Second trigger</button>
                </Popup.Trigger>
                <Popup.Portal>
                    <div>First portal</div>
                </Popup.Portal>
                <Popup.Portal>
                    <div>Second portal</div>
                </Popup.Portal>
            </Popup>,
        );

        expect(screen.queryByRole('button', { name: 'First trigger' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Second trigger' })).toBeInTheDocument();
        expect(screen.queryByText('First portal')).not.toBeInTheDocument();
        expect(screen.getByText('Second portal')).toBeInTheDocument();
    });

    it('wraps a bare child with the default trigger when no explicit trigger is provided', async () => {
        render(
            <Popup>
                <button type="button">Bare trigger</button>
                <Popup.Portal>
                    <div>Wrapped portal</div>
                </Popup.Portal>
            </Popup>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Bare trigger' }));

        await waitFor(() => {
            expect(screen.getByText('Wrapped portal')).toBeInTheDocument();
        });
    });

    it('prefers the explicit trigger over a bare child', () => {
        render(
            <Popup defaultOpen>
                <button type="button">Bare trigger</button>
                <Popup.Trigger>
                    <button type="button">Explicit trigger</button>
                </Popup.Trigger>
                <Popup.Portal>
                    <div>Priority portal</div>
                </Popup.Portal>
            </Popup>,
        );

        expect(screen.queryByRole('button', { name: 'Bare trigger' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Explicit trigger' })).toBeInTheDocument();
        expect(screen.getByText('Priority portal')).toBeInTheDocument();
    });
});
