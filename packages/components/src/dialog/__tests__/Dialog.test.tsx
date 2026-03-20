import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Dialog from '..';

describe('Dialog', () => {
    it('uses centered modal placement by default', async () => {
        render(
            <Dialog defaultOpen>
                <Dialog.Portal>
                    <Dialog.Body>Centered dialog</Dialog.Body>
                </Dialog.Portal>
            </Dialog>,
        );

        const dialog = await screen.findByRole('dialog');

        expect(dialog.className).toContain('max-w-[36rem]');
    });

    it('renders semantic sections directly inside Dialog.Portal and closes through Dialog.Close', async () => {
        render(
            <Dialog defaultOpen>
                <Dialog.Portal>
                    <Dialog.Header>Dialog title</Dialog.Header>
                    <Dialog.Body>Dialog body</Dialog.Body>
                    <Dialog.Footer>
                        <button type="button">Confirm</button>
                    </Dialog.Footer>
                    <Dialog.Close />
                </Dialog.Portal>
            </Dialog>,
        );

        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        expect(document.body.querySelector('.nd-modal-header')).toHaveTextContent('Dialog title');
        expect(document.body.querySelector('.nd-modal-body')).toHaveTextContent('Dialog body');
        expect(document.body.querySelector('.nd-modal-footer')).toHaveTextContent('Confirm');

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('ignores ordinary children that are not declared as dialog slots', async () => {
        render(
            <Dialog defaultOpen>
                <Dialog.Portal>
                    <Dialog.Header>Slot-only dialog</Dialog.Header>
                    <p>Ignored content</p>
                </Dialog.Portal>
            </Dialog>,
        );

        await screen.findByRole('dialog');

        expect(document.body.querySelector('.nd-modal-body')).not.toBeInTheDocument();
        expect(screen.getByRole('dialog')).not.toHaveTextContent('Ignored content');
    });

    it('keeps the dialog open when Dialog.Close prevents default', async () => {
        render(
            <Dialog defaultOpen>
                <Dialog.Portal>
                    <Dialog.Body>Persistent dialog</Dialog.Body>
                    <Dialog.Close
                        onClick={evt => {
                            evt.preventDefault();
                        }}
                    />
                </Dialog.Portal>
            </Dialog>,
        );

        await screen.findByRole('dialog');
        fireEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(screen.getByRole('dialog')).toHaveTextContent('Persistent dialog');
    });
});
