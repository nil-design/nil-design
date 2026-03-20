import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Drawer from '..';

describe('Drawer', () => {
    it('uses right placement by default', async () => {
        render(
            <Drawer defaultOpen>
                <Drawer.Portal>
                    <Drawer.Body>Default drawer</Drawer.Body>
                </Drawer.Portal>
            </Drawer>,
        );

        const dialog = await screen.findByRole('dialog');

        expect(dialog.className).toContain('rounded-l-xl');
    });

    it('supports all drawer directions', async () => {
        render(
            <>
                <Drawer defaultOpen placement="left">
                    <Drawer.Portal>
                        <Drawer.Body>Left drawer</Drawer.Body>
                    </Drawer.Portal>
                </Drawer>
                <Drawer defaultOpen placement="right">
                    <Drawer.Portal>
                        <Drawer.Body>Right drawer</Drawer.Body>
                    </Drawer.Portal>
                </Drawer>
                <Drawer defaultOpen placement="top">
                    <Drawer.Portal>
                        <Drawer.Body>Top drawer</Drawer.Body>
                    </Drawer.Portal>
                </Drawer>
                <Drawer defaultOpen placement="bottom">
                    <Drawer.Portal>
                        <Drawer.Body>Bottom drawer</Drawer.Body>
                    </Drawer.Portal>
                </Drawer>
            </>,
        );

        const dialogs = await screen.findAllByRole('dialog');

        expect(dialogs[0].className).toContain('rounded-r-xl');
        expect(dialogs[1].className).toContain('rounded-l-xl');
        expect(dialogs[2].className).toContain('rounded-b-xl');
        expect(dialogs[3].className).toContain('rounded-t-xl');
    });

    it('renders semantic sections directly inside Drawer.Portal', async () => {
        render(
            <Drawer defaultOpen>
                <Drawer.Portal>
                    <Drawer.Header>Drawer header</Drawer.Header>
                    <Drawer.Body>Drawer body</Drawer.Body>
                    <Drawer.Footer>
                        <button type="button">Save</button>
                    </Drawer.Footer>
                    <Drawer.Close />
                </Drawer.Portal>
            </Drawer>,
        );

        expect(await screen.findByRole('dialog')).toBeInTheDocument();
        expect(document.body.querySelector('.nd-modal-header')).toHaveTextContent('Drawer header');
        expect(document.body.querySelector('.nd-modal-body')).toHaveTextContent('Drawer body');
        expect(document.body.querySelector('.nd-modal-footer')).toHaveTextContent('Save');

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });

    it('ignores ordinary children that are not declared as drawer slots', async () => {
        render(
            <Drawer defaultOpen>
                <Drawer.Portal>
                    <Drawer.Header>Slot-only drawer</Drawer.Header>
                    <p>Ignored drawer content</p>
                </Drawer.Portal>
            </Drawer>,
        );

        await screen.findByRole('dialog');

        expect(document.body.querySelector('.nd-modal-body')).not.toBeInTheDocument();
        expect(screen.getByRole('dialog')).not.toHaveTextContent('Ignored drawer content');
    });
});
