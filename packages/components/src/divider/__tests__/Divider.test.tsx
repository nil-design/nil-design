import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import Divider from '..';
import { Divider as RootDivider } from '../../index';

describe('Divider', () => {
    it('is exported from the package root', () => {
        expect(RootDivider).toBe(Divider);
    });

    it('renders children and forwards html props', () => {
        render(
            <Divider aria-label="section divider" data-kind="content" role="separator">
                Account
            </Divider>,
        );

        const divider = screen.getByRole('separator', { name: 'section divider' });

        expect(divider).toHaveTextContent('Account');
        expect(divider).toHaveAttribute('data-kind', 'content');
    });

    it('forwards refs to the divider element', () => {
        const ref = createRef<HTMLDivElement>();

        render(<Divider ref={ref}>Section</Divider>);

        expect(ref.current).toBeInstanceOf(HTMLDivElement);
        expect(ref.current).toHaveTextContent('Section');
    });

    it('renders empty and configured dividers without dropping props', () => {
        render(
            <>
                <Divider aria-label="empty divider" role="separator" />
                <Divider
                    align="left"
                    aria-label="vertical divider"
                    direction="vertical"
                    role="separator"
                    variant="dashed"
                >
                    Details
                </Divider>
            </>,
        );

        expect(screen.getByRole('separator', { name: 'empty divider' })).toBeEmptyDOMElement();
        expect(screen.getByRole('separator', { name: 'vertical divider' })).toHaveTextContent('Details');
    });
});
