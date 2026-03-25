import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Modal from '..';

const getPortal = (dialog: HTMLElement) => {
    return dialog.parentElement as HTMLElement;
};

const getOverlay = (dialog: HTMLElement) => {
    return getPortal(dialog).querySelector('.nd-modal-overlay') as HTMLElement | null;
};

const advanceEnterMotion = () => {
    act(() => {
        vi.runOnlyPendingTimers();
    });

    act(() => {
        vi.runOnlyPendingTimers();
    });
};

const finishExitMotion = (dialog: HTMLElement) => {
    act(() => {
        vi.runOnlyPendingTimers();
    });

    fireEvent.transitionEnd(dialog);
};

describe('Modal', () => {
    beforeEach(() => {
        vi.useRealTimers();
        vi.clearAllTimers();
        document.body.innerHTML = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    });

    it('defaults to the dialog variant with centered placement and rounded surface styles', async () => {
        render(
            <Modal defaultOpen>
                <Modal.Portal>
                    <Modal.Body>Centered dialog</Modal.Body>
                </Modal.Portal>
            </Modal>,
        );

        const dialog = await screen.findByRole('dialog');

        expect(dialog.className).toContain('max-w-[36rem]');
        expect(dialog.className).toContain('rounded-xl');
        expect(dialog.className).toContain('scale-100');
        expect(getOverlay(dialog)?.className).toContain('opacity-100');
    });

    it('defaults the drawer variant to right placement without rounded surface styles', async () => {
        render(
            <Modal defaultOpen variant="drawer">
                <Modal.Portal>
                    <Modal.Body>Default drawer</Modal.Body>
                </Modal.Portal>
            </Modal>,
        );

        const dialog = await screen.findByRole('dialog');

        expect(dialog.className).toContain('w-[28rem]');
        expect(dialog.className).toContain('translate-x-0');
        expect(dialog.className).not.toMatch(/\brounded-/);
    });

    it('supports all drawer directions without rounded surface styles', async () => {
        render(
            <>
                <Modal defaultOpen placement="left" variant="drawer">
                    <Modal.Portal>
                        <Modal.Body>Left drawer</Modal.Body>
                    </Modal.Portal>
                </Modal>
                <Modal defaultOpen placement="right" variant="drawer">
                    <Modal.Portal>
                        <Modal.Body>Right drawer</Modal.Body>
                    </Modal.Portal>
                </Modal>
                <Modal defaultOpen placement="top" variant="drawer">
                    <Modal.Portal>
                        <Modal.Body>Top drawer</Modal.Body>
                    </Modal.Portal>
                </Modal>
                <Modal defaultOpen placement="bottom" variant="drawer">
                    <Modal.Portal>
                        <Modal.Body>Bottom drawer</Modal.Body>
                    </Modal.Portal>
                </Modal>
            </>,
        );

        const dialogs = await screen.findAllByRole('dialog');

        expect(dialogs[0].className).toContain('translate-x-0');
        expect(dialogs[1].className).toContain('translate-x-0');
        expect(dialogs[2].className).toContain('translate-y-0');
        expect(dialogs[3].className).toContain('translate-y-0');
        dialogs.forEach(dialog => {
            expect(dialog.className).not.toMatch(/\brounded-/);
        });
    });

    it('recognizes explicit trigger and portal slots', async () => {
        render(
            <Modal>
                <Modal.Trigger>
                    <button type="button">Open modal</button>
                </Modal.Trigger>
                <Modal.Portal>
                    <Modal.Body>Explicit modal</Modal.Body>
                </Modal.Portal>
            </Modal>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toHaveTextContent('Explicit modal');
        });
    });

    it('calls onOpen and onClose once per requested state change', async () => {
        vi.useFakeTimers();

        try {
            const onOpen = vi.fn();
            const onClose = vi.fn();

            render(
                <Modal onClose={onClose} onOpen={onOpen}>
                    <Modal.Trigger>
                        <button type="button">Open callback modal</button>
                    </Modal.Trigger>
                    <Modal.Portal>
                        <Modal.Body>Callback modal</Modal.Body>
                    </Modal.Portal>
                </Modal>,
            );

            const trigger = screen.getByRole('button', { name: 'Open callback modal' });

            fireEvent.click(trigger);

            expect(screen.getByRole('dialog')).toHaveTextContent('Callback modal');
            expect(onOpen).toHaveBeenCalledTimes(1);
            expect(onClose).not.toHaveBeenCalled();

            fireEvent.click(trigger);

            expect(onOpen).toHaveBeenCalledTimes(1);

            const dialog = screen.getByRole('dialog');

            fireEvent.keyDown(document, { key: 'Escape' });
            finishExitMotion(dialog);

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(onClose).toHaveBeenCalledTimes(1);
        } finally {
            vi.useRealTimers();
        }
    });

    it('wraps a bare child with the default trigger when no explicit trigger is provided', async () => {
        render(
            <Modal>
                <button type="button">Bare trigger</button>
                <Modal.Portal>
                    <Modal.Body>Wrapped modal</Modal.Body>
                </Modal.Portal>
            </Modal>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Bare trigger' }));

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toHaveTextContent('Wrapped modal');
        });
    });

    it('keeps the modal closed when the trigger click handler prevents default', () => {
        render(
            <Modal>
                <Modal.Trigger>
                    <button
                        onClick={evt => {
                            evt.preventDefault();
                        }}
                        type="button"
                    >
                        Block open
                    </button>
                </Modal.Trigger>
                <Modal.Portal>
                    <Modal.Body>Blocked modal</Modal.Body>
                </Modal.Portal>
            </Modal>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Block open' }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('omits the internal overlay when overlayless is true', async () => {
        render(
            <Modal defaultOpen>
                <Modal.Portal overlayless>
                    <Modal.Body>No overlay</Modal.Body>
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
                    <Modal.Header id="modal-title">Accessible title</Modal.Header>
                    <Modal.Body id="modal-desc">Accessible description</Modal.Body>
                </Modal.Portal>
            </Modal>,
        );

        const dialog = await screen.findByRole('dialog');

        expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
        expect(dialog).toHaveAttribute('aria-describedby', 'modal-desc');
    });

    it('applies portal, overlay, and surface styling props to their respective layers', async () => {
        render(
            <Modal defaultOpen>
                <Modal.Portal
                    className="portal-root"
                    overlayClassName="portal-overlay"
                    style={{ outline: '1px solid red' }}
                    surfaceClassName="portal-surface"
                >
                    <Modal.Body>Attributed modal</Modal.Body>
                </Modal.Portal>
            </Modal>,
        );

        const dialog = await screen.findByRole('dialog');
        const portal = getPortal(dialog);
        const overlay = getOverlay(dialog);

        expect(portal.className).toContain('portal-root');
        expect(portal).toHaveStyle({ outline: '1px solid red' });
        expect(overlay).toHaveClass('portal-overlay');
        expect(dialog.className).toContain('portal-surface');
        expect(dialog.className).not.toContain('portal-root');
    });

    it('renders semantic sections directly inside Modal.Portal and closes through the default close button', async () => {
        vi.useFakeTimers();

        try {
            render(
                <Modal defaultOpen variant="drawer">
                    <Modal.Portal>
                        <Modal.Header>Drawer header</Modal.Header>
                        <Modal.Body>Drawer body</Modal.Body>
                        <Modal.Footer>
                            <button type="button">Save</button>
                        </Modal.Footer>
                    </Modal.Portal>
                </Modal>,
            );

            const dialog = screen.getByRole('dialog');

            expect(dialog).toBeInTheDocument();
            expect(document.body.querySelector('.nd-modal-header')).toHaveTextContent('Drawer header');
            expect(document.body.querySelector('.nd-modal-header')).toHaveClass('pr-16');
            expect(document.body.querySelector('.nd-modal-body')).toHaveTextContent('Drawer body');
            expect(document.body.querySelector('.nd-modal-footer')).toHaveTextContent('Save');

            fireEvent.click(screen.getByRole('button', { name: 'Close' }));
            finishExitMotion(dialog);

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('ignores unsupported children inside Modal.Portal', async () => {
        render(
            <Modal defaultOpen>
                <Modal.Portal>
                    <p>Ignored content</p>
                </Modal.Portal>
            </Modal>,
        );

        await screen.findByRole('dialog');

        expect(document.body.querySelector('.nd-modal-body')).not.toBeInTheDocument();
        expect(screen.getByRole('dialog')).not.toHaveTextContent('Ignored content');
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('renders a default close button when no explicit Close is provided', async () => {
        vi.useFakeTimers();

        try {
            render(
                <Modal defaultOpen>
                    <Modal.Portal>
                        <Modal.Body>Closable modal</Modal.Body>
                    </Modal.Portal>
                </Modal>,
            );

            const dialog = screen.getByRole('dialog');

            expect(dialog).toHaveTextContent('Closable modal');
            expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();

            fireEvent.click(screen.getByRole('button', { name: 'Close' }));
            finishExitMotion(dialog);

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('uses an explicit Close without rendering a fallback close button', async () => {
        render(
            <Modal defaultOpen>
                <Modal.Portal>
                    <Modal.Body>Explicit close modal</Modal.Body>
                    <Modal.Close
                        aria-label="Dismiss modal"
                        onClick={evt => {
                            evt.preventDefault();
                        }}
                    />
                </Modal.Portal>
            </Modal>,
        );

        expect(await screen.findByRole('dialog')).toHaveTextContent('Explicit close modal');
        expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Dismiss modal' }));

        expect(screen.getByRole('dialog')).toHaveTextContent('Explicit close modal');
    });

    it('applies dialog overlay and surface motion classes on enter and exit', async () => {
        vi.useFakeTimers();

        try {
            render(
                <Modal>
                    <Modal.Trigger>
                        <button type="button">Open dialog motion</button>
                    </Modal.Trigger>
                    <Modal.Portal overlayClassName="portal-overlay" surfaceClassName="portal-surface">
                        <Modal.Body>Dialog motion</Modal.Body>
                    </Modal.Portal>
                </Modal>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Open dialog motion' }));

            const dialogSurface = screen.getByRole('dialog');
            const dialogOverlay = getOverlay(dialogSurface) as HTMLElement;

            expect(dialogSurface.className).toContain('portal-surface');
            expect(dialogSurface.className).toContain('scale-95');
            expect(dialogOverlay.className).toContain('portal-overlay');
            expect(dialogOverlay.className).toContain('opacity-0');

            advanceEnterMotion();

            expect(dialogSurface.className).toContain('scale-100');
            expect(dialogOverlay.className).toContain('opacity-100');

            fireEvent.keyDown(document, { key: 'Escape' });
            expect(dialogSurface.className).toContain('scale-95');
            expect(dialogOverlay.className).toContain('opacity-0');

            finishExitMotion(dialogSurface);
            expect(screen.queryByText('Dialog motion')).not.toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it('applies drawer motion classes on enter and exit for every placement', async () => {
        vi.useFakeTimers();

        try {
            render(
                <>
                    <Modal placement="left" variant="drawer">
                        <Modal.Trigger>
                            <button type="button">Open left drawer</button>
                        </Modal.Trigger>
                        <Modal.Portal overlayClassName="drawer-overlay" surfaceClassName="drawer-surface-left">
                            <Modal.Body>Left drawer motion</Modal.Body>
                        </Modal.Portal>
                    </Modal>
                    <Modal placement="right" variant="drawer">
                        <Modal.Trigger>
                            <button type="button">Open right drawer</button>
                        </Modal.Trigger>
                        <Modal.Portal overlayClassName="drawer-overlay" surfaceClassName="drawer-surface-right">
                            <Modal.Body>Right drawer motion</Modal.Body>
                        </Modal.Portal>
                    </Modal>
                    <Modal placement="top" variant="drawer">
                        <Modal.Trigger>
                            <button type="button">Open top drawer</button>
                        </Modal.Trigger>
                        <Modal.Portal overlayClassName="drawer-overlay" surfaceClassName="drawer-surface-top">
                            <Modal.Body>Top drawer motion</Modal.Body>
                        </Modal.Portal>
                    </Modal>
                    <Modal placement="bottom" variant="drawer">
                        <Modal.Trigger>
                            <button type="button">Open bottom drawer</button>
                        </Modal.Trigger>
                        <Modal.Portal overlayClassName="drawer-overlay" surfaceClassName="drawer-surface-bottom">
                            <Modal.Body>Bottom drawer motion</Modal.Body>
                        </Modal.Portal>
                    </Modal>
                </>,
            );

            const drawerCases = [
                {
                    button: 'Open left drawer',
                    customClass: 'drawer-surface-left',
                    text: 'Left drawer motion',
                    hiddenClass: '-translate-x-full',
                    visibleClass: 'translate-x-0',
                },
                {
                    button: 'Open right drawer',
                    customClass: 'drawer-surface-right',
                    text: 'Right drawer motion',
                    hiddenClass: 'translate-x-full',
                    visibleClass: 'translate-x-0',
                },
                {
                    button: 'Open top drawer',
                    customClass: 'drawer-surface-top',
                    text: 'Top drawer motion',
                    hiddenClass: '-translate-y-full',
                    visibleClass: 'translate-y-0',
                },
                {
                    button: 'Open bottom drawer',
                    customClass: 'drawer-surface-bottom',
                    text: 'Bottom drawer motion',
                    hiddenClass: 'translate-y-full',
                    visibleClass: 'translate-y-0',
                },
            ] as const;

            for (const drawerCase of drawerCases) {
                fireEvent.click(screen.getByRole('button', { name: drawerCase.button }));

                const drawerSurface = screen.getByRole('dialog');
                const drawerOverlay = getOverlay(drawerSurface) as HTMLElement;

                expect(drawerSurface.className).toContain(drawerCase.customClass);
                expect(drawerSurface.className).toContain(drawerCase.hiddenClass);
                expect(drawerOverlay.className).toContain('drawer-overlay');
                expect(drawerOverlay.className).toContain('opacity-0');

                advanceEnterMotion();

                expect(drawerSurface.className).toContain(drawerCase.visibleClass);
                expect(drawerOverlay.className).toContain('opacity-100');

                fireEvent.keyDown(document, { key: 'Escape' });
                expect(drawerSurface.className).toContain(drawerCase.hiddenClass);
                expect(drawerOverlay.className).toContain('opacity-0');

                finishExitMotion(drawerSurface);
                expect(screen.queryByText(drawerCase.text)).not.toBeInTheDocument();
            }
        } finally {
            vi.useRealTimers();
        }
    });

    it('focuses the first focusable element, traps tab navigation, and restores focus on escape close', async () => {
        vi.useFakeTimers();

        try {
            render(
                <Modal>
                    <Modal.Trigger>
                        <button type="button">Launch</button>
                    </Modal.Trigger>
                    <Modal.Portal>
                        <Modal.Body>
                            <button type="button">First action</button>
                            <button type="button">Last action</button>
                        </Modal.Body>
                    </Modal.Portal>
                </Modal>,
            );

            const trigger = screen.getByRole('button', { name: 'Launch' });

            trigger.focus();
            fireEvent.click(trigger);

            act(() => {
                vi.runAllTimers();
            });

            expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus();

            const firstAction = screen.getByRole('button', { name: 'First action' });
            const lastAction = screen.getByRole('button', { name: 'Last action' });
            const closeButton = screen.getByRole('button', { name: 'Close' });
            const dialog = screen.getByRole('dialog');

            expect(lastAction).not.toHaveFocus();

            closeButton.focus();
            fireEvent.keyDown(document, { key: 'Tab' });
            expect(firstAction).toHaveFocus();

            firstAction.focus();
            fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
            expect(closeButton).toHaveFocus();

            fireEvent.keyDown(document, { key: 'Escape' });
            expect(dialog).toBeInTheDocument();
            expect(trigger).not.toHaveFocus();

            finishExitMotion(dialog);

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
            expect(trigger).toHaveFocus();
        } finally {
            vi.useRealTimers();
        }
    });

    it('focuses the dialog surface when no focusable descendants are available', async () => {
        vi.useFakeTimers();

        try {
            render(
                <Modal>
                    <Modal.Trigger>
                        <button type="button">Launch plain modal</button>
                    </Modal.Trigger>
                    <Modal.Portal>
                        <Modal.Body>Plain content</Modal.Body>
                        <Modal.Close disabled />
                    </Modal.Portal>
                </Modal>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Launch plain modal' }));

            act(() => {
                vi.runAllTimers();
            });

            expect(screen.getByRole('dialog')).toHaveFocus();
        } finally {
            vi.useRealTimers();
        }
    });

    it('returns focus to the active modal scope when focus moves outside the surface', async () => {
        vi.useFakeTimers();

        try {
            render(
                <>
                    <button type="button">Outside action</button>
                    <Modal>
                        <Modal.Trigger>
                            <button type="button">Launch guarded modal</button>
                        </Modal.Trigger>
                        <Modal.Portal>
                            <Modal.Body>
                                <button type="button">First action</button>
                                <button type="button">Last action</button>
                            </Modal.Body>
                        </Modal.Portal>
                    </Modal>
                </>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Launch guarded modal' }));

            act(() => {
                vi.runAllTimers();
            });

            const firstAction = screen.getByRole('button', { name: 'First action' });
            const outsideAction = screen.getByRole('button', { name: 'Outside action' });

            expect(firstAction).toHaveFocus();

            act(() => {
                outsideAction.focus();
            });

            expect(firstAction).toHaveFocus();
            expect(outsideAction).not.toHaveFocus();
        } finally {
            vi.useRealTimers();
        }
    });

    it('keeps the modal open when closeOnEscape is false', async () => {
        render(
            <Modal defaultOpen closeOnEscape={false}>
                <Modal.Portal>
                    <Modal.Body>Persistent modal</Modal.Body>
                </Modal.Portal>
            </Modal>,
        );

        await screen.findByRole('dialog');
        fireEvent.keyDown(document, { key: 'Escape' });

        expect(screen.getByRole('dialog')).toHaveTextContent('Persistent modal');
    });

    it('closes on overlay click by default and ignores overlay clicks when disabled', async () => {
        vi.useFakeTimers();

        try {
            const { unmount } = render(
                <Modal defaultOpen>
                    <Modal.Portal>
                        <Modal.Body>Overlay modal</Modal.Body>
                    </Modal.Portal>
                </Modal>,
            );

            const dialog = screen.getByRole('dialog');
            const overlay = getOverlay(dialog);

            fireEvent.click(overlay as Element);
            expect(dialog).toBeInTheDocument();

            finishExitMotion(dialog);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

            unmount();

            render(
                <Modal defaultOpen closeOnOverlayClick={false}>
                    <Modal.Portal>
                        <Modal.Body>Sticky overlay modal</Modal.Body>
                    </Modal.Portal>
                </Modal>,
            );

            const stickyDialog = screen.getByRole('dialog');
            const stickyOverlay = getOverlay(stickyDialog);

            fireEvent.click(stickyOverlay as Element);

            expect(screen.getByRole('dialog')).toHaveTextContent('Sticky overlay modal');
        } finally {
            vi.useRealTimers();
        }
    });

    it('locks body scroll and only allows the topmost modal to close first', async () => {
        vi.useFakeTimers();

        try {
            const Demo = () => {
                const [firstOpen, setFirstOpen] = useState(true);
                const [secondOpen, setSecondOpen] = useState(true);

                return (
                    <>
                        <Modal open={firstOpen} onClose={() => setFirstOpen(false)}>
                            <Modal.Portal>
                                <Modal.Body>First modal</Modal.Body>
                            </Modal.Portal>
                        </Modal>
                        <Modal open={secondOpen} onClose={() => setSecondOpen(false)}>
                            <Modal.Portal>
                                <Modal.Body>Second modal</Modal.Body>
                            </Modal.Portal>
                        </Modal>
                    </>
                );
            };

            render(<Demo />);

            const dialogs = screen.getAllByRole('dialog');

            expect(dialogs[0].parentElement).toHaveStyle({ zIndex: '40' });
            expect(dialogs[1].parentElement).toHaveStyle({ zIndex: '41' });
            expect(document.body.style.overflow).toBe('hidden');

            fireEvent.keyDown(document, { key: 'Escape' });

            expect(screen.getByText('Second modal')).toBeInTheDocument();

            fireEvent.keyDown(document, { key: 'Escape' });

            expect(screen.getByText('First modal')).toBeInTheDocument();
            expect(screen.getByText('Second modal')).toBeInTheDocument();
            expect(document.body.style.overflow).toBe('hidden');

            finishExitMotion(dialogs[1]);

            expect(screen.queryByText('Second modal')).not.toBeInTheDocument();
            expect(screen.getByText('First modal')).toBeInTheDocument();
            expect(document.body.style.overflow).toBe('hidden');

            fireEvent.keyDown(document, { key: 'Escape' });
            finishExitMotion(screen.getByRole('dialog'));

            expect(screen.queryByText('First modal')).not.toBeInTheDocument();
            expect(document.body.style.overflow).toBe('');
        } finally {
            vi.useRealTimers();
        }
    });

    it('skips body padding compensation when the root already reserves scrollbar gutter', async () => {
        const originalGetComputedStyle = window.getComputedStyle.bind(window);
        const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle');
        const originalInnerWidth = window.innerWidth;
        const originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'clientWidth');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 1000,
        });
        Object.defineProperty(document.documentElement, 'clientWidth', {
            configurable: true,
            get: () => 980,
        });

        try {
            getComputedStyleSpy.mockImplementation(element => {
                const style = originalGetComputedStyle(element);

                if (element === document.documentElement) {
                    return new Proxy(style, {
                        get(target, property, receiver) {
                            if (property === 'scrollbarGutter') {
                                return 'stable';
                            }

                            if (property === 'getPropertyValue') {
                                return (name: string) => {
                                    if (name === 'scrollbar-gutter') {
                                        return 'stable';
                                    }

                                    return target.getPropertyValue(name);
                                };
                            }

                            return Reflect.get(target, property, receiver);
                        },
                    }) as CSSStyleDeclaration;
                }

                return style;
            });

            render(
                <Modal defaultOpen>
                    <Modal.Portal>
                        <Modal.Body>Stable gutter modal</Modal.Body>
                    </Modal.Portal>
                </Modal>,
            );

            await screen.findByRole('dialog');

            expect(document.body.style.overflow).toBe('hidden');
            expect(document.body.style.paddingRight).toBe('');
        } finally {
            getComputedStyleSpy.mockRestore();

            if (originalClientWidthDescriptor) {
                Object.defineProperty(document.documentElement, 'clientWidth', originalClientWidthDescriptor);
            }
            Object.defineProperty(window, 'innerWidth', {
                configurable: true,
                value: originalInnerWidth,
            });
        }
    });
});
