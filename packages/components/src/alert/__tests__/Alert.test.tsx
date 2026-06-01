import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Alert from '..';
import { Alert as RootAlert } from '../../index';

describe('Alert', () => {
    it('is exported from the package root and renders an alert by default', () => {
        expect(RootAlert).toBe(Alert);

        render(<Alert>Service will restart tonight.</Alert>);

        expect(screen.getByRole('alert')).toHaveTextContent('Service will restart tonight.');
    });

    it('forwards refs and html props while allowing role override', () => {
        const ref = createRef<HTMLDivElement>();

        render(
            <Alert data-kind="quiet" ref={ref} role="status">
                Saved successfully.
            </Alert>,
        );

        const alert = screen.getByRole('status');

        expect(ref.current).toBe(alert);
        expect(alert).toHaveAttribute('data-kind', 'quiet');
        expect(alert).toHaveTextContent('Saved successfully.');
    });

    it('renders title and body content for each alert type', () => {
        (['info', 'success', 'warning', 'error'] as const).forEach(type => {
            const { unmount } = render(
                <Alert title={`${type} title`} type={type}>
                    {`${type} body`}
                </Alert>,
            );

            const alert = screen.getByRole('alert');

            expect(alert).toHaveTextContent(`${type} title`);
            expect(alert).toHaveTextContent(`${type} body`);

            unmount();
        });
    });

    it('renders default, custom, and hidden icons without exposing default icons to assistive names', () => {
        const { container, rerender } = render(<Alert>Default icon</Alert>);

        expect(container.querySelector('[aria-hidden="true"] svg')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();

        rerender(<Alert icon={<span data-testid="custom-icon">!</span>}>Custom icon</Alert>);

        expect(screen.getByTestId('custom-icon')).toHaveTextContent('!');

        rerender(<Alert icon={false}>No icon</Alert>);

        expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
        expect(container.querySelector('[aria-hidden="true"] svg')).not.toBeInTheDocument();
    });

    it('closes itself in uncontrolled mode and reports the close event', () => {
        const onClose = vi.fn();

        render(
            <Alert closable onClose={onClose}>
                Temporary notice.
            </Alert>,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClose.mock.calls[0][0].type).toBe('click');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('keeps controlled visibility external and supports a custom close label', () => {
        const onClose = vi.fn();
        const { rerender } = render(
            <Alert closable closeAriaLabel="关闭提示" visible onClose={onClose}>
                Controlled notice.
            </Alert>,
        );

        fireEvent.click(screen.getByRole('button', { name: '关闭提示' }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('alert')).toHaveTextContent('Controlled notice.');

        rerender(
            <Alert closable closeAriaLabel="关闭提示" visible={false} onClose={onClose}>
                Controlled notice.
            </Alert>,
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
