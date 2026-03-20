import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import Modal from '..';

describe('Modal', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    });

    it('recognizes explicit trigger and portal slots', async () => {
        render(
            <Modal>
                <Modal.Trigger>
                    <button type="button">Open modal</button>
                </Modal.Trigger>
                <Modal.Portal>
                    <div>Explicit modal</div>
                </Modal.Portal>
            </Modal>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toHaveTextContent('Explicit modal');
        });
    });

    it('wraps a bare child with the default trigger when no explicit trigger is provided', async () => {
        render(
            <Modal>
                <button type="button">Bare trigger</button>
                <Modal.Portal>
                    <div>Wrapped modal</div>
                </Modal.Portal>
            </Modal>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Bare trigger' }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toHaveTextContent('Wrapped modal');
        });
    });

    it('omits the internal overlay when overlaid is false', async () => {
        render(
            <Modal defaultOpen>
                <Modal.Portal overlaid={false}>
                    <div>No overlay</div>
                </Modal.Portal>
            </Modal>,
        );

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toHaveTextContent('No overlay');
        });

        expect(document.body.querySelector('.nd-modal-overlay')).not.toBeInTheDocument();
    });

    it('maps root aria attributes to the dialog surface', async () => {
        render(
            <Modal aria-labelledby="modal-title" aria-describedby="modal-desc" defaultOpen>
                <Modal.Portal>
                    <h2 id="modal-title">Accessible title</h2>
                    <p id="modal-desc">Accessible description</p>
                </Modal.Portal>
            </Modal>,
        );

        const dialog = await screen.findByRole('dialog');

        expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
        expect(dialog).toHaveAttribute('aria-describedby', 'modal-desc');
    });

    it('focuses the first focusable element, traps tab navigation, and restores focus on escape close', async () => {
        render(
            <Modal>
                <Modal.Trigger>
                    <button type="button">Launch</button>
                </Modal.Trigger>
                <Modal.Portal>
                    <button type="button">First action</button>
                    <button type="button">Last action</button>
                </Modal.Portal>
            </Modal>,
        );

        const trigger = screen.getByRole('button', { name: 'Launch' });

        trigger.focus();
        fireEvent.click(trigger);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus();
        });

        const firstAction = screen.getByRole('button', { name: 'First action' });
        const lastAction = screen.getByRole('button', { name: 'Last action' });

        lastAction.focus();
        fireEvent.keyDown(document, { key: 'Tab' });
        expect(firstAction).toHaveFocus();

        firstAction.focus();
        fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
        expect(lastAction).toHaveFocus();

        fireEvent.keyDown(document, { key: 'Escape' });

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        expect(trigger).toHaveFocus();
    });

    it('keeps the modal open when closeOnEscape is false', async () => {
        render(
            <Modal defaultOpen closeOnEscape={false}>
                <Modal.Portal>
                    <div>Persistent modal</div>
                </Modal.Portal>
            </Modal>,
        );

        await screen.findByRole('dialog');
        fireEvent.keyDown(document, { key: 'Escape' });

        expect(screen.getByRole('dialog')).toHaveTextContent('Persistent modal');
    });

    it('closes on overlay click by default and ignores overlay clicks when disabled', async () => {
        const { unmount } = render(
            <Modal defaultOpen>
                <Modal.Portal>
                    <div>Overlay modal</div>
                </Modal.Portal>
            </Modal>,
        );

        const overlay = await waitFor(() => document.body.querySelector('.nd-modal-overlay'));

        fireEvent.click(overlay as Element);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        unmount();

        render(
            <Modal defaultOpen closeOnOverlayClick={false}>
                <Modal.Portal>
                    <div>Sticky overlay modal</div>
                </Modal.Portal>
            </Modal>,
        );

        const stickyOverlay = await waitFor(() => document.body.querySelector('.nd-modal-overlay'));

        fireEvent.click(stickyOverlay as Element);

        expect(screen.getByRole('dialog')).toHaveTextContent('Sticky overlay modal');
    });

    it('locks body scroll and only allows the topmost modal to close first', async () => {
        const Demo = () => {
            const [firstOpen, setFirstOpen] = useState(true);
            const [secondOpen, setSecondOpen] = useState(true);

            return (
                <>
                    <Modal open={firstOpen} onClose={() => setFirstOpen(false)}>
                        <Modal.Portal>
                            <div>First modal</div>
                        </Modal.Portal>
                    </Modal>
                    <Modal open={secondOpen} onClose={() => setSecondOpen(false)}>
                        <Modal.Portal>
                            <div>Second modal</div>
                        </Modal.Portal>
                    </Modal>
                </>
            );
        };

        render(<Demo />);

        await waitFor(() => {
            expect(screen.getAllByRole('dialog')).toHaveLength(2);
        });

        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.keyDown(document, { key: 'Escape' });

        await waitFor(() => {
            expect(screen.queryByText('Second modal')).not.toBeInTheDocument();
        });

        expect(screen.getByText('First modal')).toBeInTheDocument();
        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.keyDown(document, { key: 'Escape' });

        await waitFor(() => {
            expect(screen.queryByText('First modal')).not.toBeInTheDocument();
        });

        expect(document.body.style.overflow).toBe('');
    });
});
