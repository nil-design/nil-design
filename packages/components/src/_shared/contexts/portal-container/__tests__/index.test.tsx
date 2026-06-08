import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PortalContainerProvider, usePortalContainerContext } from '../index';

const Probe = () => {
    const { container } = usePortalContainerContext();

    return <span data-testid="container-id">{container?.dataset.testid ?? 'none'}</span>;
};

const createContainer = (testid: string) => {
    const $container = document.createElement('div');

    $container.dataset.testid = testid;

    return $container;
};

describe('portal container context', () => {
    it('returns a null container by default', () => {
        render(<Probe />);

        expect(screen.getByTestId('container-id')).toHaveTextContent('none');
    });

    it('provides a container to descendants', () => {
        const container = createContainer('outer');

        render(
            <PortalContainerProvider value={{ container }}>
                <Probe />
            </PortalContainerProvider>,
        );

        expect(screen.getByTestId('container-id')).toHaveTextContent('outer');
    });

    it('uses the nearest portal container provider', () => {
        const outerContainer = createContainer('outer');
        const innerContainer = createContainer('inner');

        render(
            <PortalContainerProvider value={{ container: outerContainer }}>
                <PortalContainerProvider value={{ container: innerContainer }}>
                    <Probe />
                </PortalContainerProvider>
            </PortalContainerProvider>,
        );

        expect(screen.getByTestId('container-id')).toHaveTextContent('inner');
    });
});
