import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Transition from '..';
import { TransitionStatus } from '../interfaces';

describe('Transition', () => {
    beforeEach(() => {
        vi.useRealTimers();
        vi.clearAllTimers();
    });

    it('applies the default status classes in element mode', async () => {
        vi.useFakeTimers();

        const { rerender } = render(
            <Transition visible={false}>
                <div data-testid="target" />
            </Transition>,
        );

        expect(screen.getByTestId('target').className).toContain('opacity-0');
        expect(screen.getByTestId('target').className).toContain('invisible');

        rerender(
            <Transition visible>
                <div data-testid="target" />
            </Transition>,
        );

        expect(screen.getByTestId('target').className).toContain('opacity-0');
        expect(screen.getByTestId('target').className).toContain('invisible');

        act(() => {
            vi.runOnlyPendingTimers();
        });

        expect(screen.getByTestId('target').className).toContain('opacity-100');
        expect(screen.getByTestId('target').className).toContain('visible');

        rerender(
            <Transition visible={false}>
                <div data-testid="target" />
            </Transition>,
        );

        expect(screen.getByTestId('target').className).toContain('opacity-0');

        act(() => {
            vi.runOnlyPendingTimers();
        });

        expect(screen.getByTestId('target').className).toContain('invisible');
    });

    it('passes status to a render-function child without merging transition class props', async () => {
        vi.useFakeTimers();

        const renderStatus = (status: TransitionStatus) => (
            <div data-testid="target" className={`status-${status}`}>
                {status}
            </div>
        );
        const { rerender } = render(
            <Transition className="shared-transition" visible={false}>
                {renderStatus}
            </Transition>,
        );

        expect(screen.getByTestId('target')).toHaveClass(`status-${TransitionStatus.EXITED}`);
        expect(screen.getByTestId('target')).not.toHaveClass('shared-transition');

        rerender(
            <Transition className="shared-transition" visible>
                {renderStatus}
            </Transition>,
        );

        expect(screen.getByTestId('target')).toHaveClass(`status-${TransitionStatus.ENTERING}`);
        expect(screen.getByTestId('target')).not.toHaveClass('shared-transition');

        act(() => {
            vi.runOnlyPendingTimers();
        });

        expect(screen.getByTestId('target')).toHaveClass(`status-${TransitionStatus.ENTERED}`);
    });

    it('supports unmounting in render-function mode when the target exited render is empty', async () => {
        vi.useFakeTimers();

        const handleTransitionEnd = vi.fn();
        const renderStatus = (status: TransitionStatus) => {
            if (status === TransitionStatus.UNMOUNTED || status === TransitionStatus.EXITED) {
                return null;
            }

            return (
                <div data-testid="target" onTransitionEnd={handleTransitionEnd}>
                    {status}
                </div>
            );
        };
        const { rerender } = render(<Transition visible>{renderStatus}</Transition>);

        expect(screen.getByTestId('target')).toHaveTextContent(TransitionStatus.ENTERED);

        rerender(<Transition visible={false}>{renderStatus}</Transition>);

        expect(screen.getByTestId('target')).toHaveTextContent(TransitionStatus.EXITING);

        act(() => {
            vi.runOnlyPendingTimers();
        });

        const target = screen.getByTestId('target');

        fireEvent.transitionEnd(target);

        expect(handleTransitionEnd).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId('target')).not.toBeInTheDocument();
    });

    it('can enter after a render-function child starts returning an element', async () => {
        vi.useFakeTimers();

        const createRenderStatus = (mounted: boolean) => (status: TransitionStatus) => {
            if (!mounted) {
                return null;
            }

            return <div data-testid="target">{status}</div>;
        };
        const { rerender } = render(<Transition visible>{createRenderStatus(false)}</Transition>);

        expect(screen.queryByTestId('target')).not.toBeInTheDocument();

        rerender(<Transition visible>{createRenderStatus(true)}</Transition>);

        expect(screen.getByTestId('target')).toBeInTheDocument();

        act(() => {
            vi.runAllTimers();
        });

        expect(screen.getByTestId('target')).toHaveTextContent(TransitionStatus.ENTERED);
    });

    it('preserves the child transition handler while still unmounting after removal', async () => {
        vi.useFakeTimers();

        const handleTransitionEnd = vi.fn();
        const { rerender } = render(
            <Transition>
                <div data-testid="target" onTransitionEnd={handleTransitionEnd} />
            </Transition>,
        );

        rerender(<Transition>{null}</Transition>);

        act(() => {
            vi.runOnlyPendingTimers();
        });

        const target = screen.getByTestId('target');

        fireEvent.transitionEnd(target);

        expect(handleTransitionEnd).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId('target')).not.toBeInTheDocument();
    });
});
