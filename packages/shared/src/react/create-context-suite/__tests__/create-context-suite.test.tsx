// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import createContextSuite from '../index';

describe('createContextSuite', () => {
    describe('when provider is missing', () => {
        it('should return default context value', () => {
            const [, useTheme] = createContextSuite({
                defaultValue: 'light',
            });

            const Consumer = () => <span>{useTheme()}</span>;

            render(<Consumer />);

            expect(screen.getByText('light')).toBeInTheDocument();
        });
    });

    describe('when provider is present', () => {
        it('should return provider value', () => {
            const [ThemeProvider, useTheme] = createContextSuite({
                displayName: 'ThemeContext',
                defaultValue: 'light',
            });

            const Consumer = () => <span>{useTheme()}</span>;

            render(
                <ThemeProvider value="dark">
                    <Consumer />
                </ThemeProvider>,
            );

            expect(screen.getByText('dark')).toBeInTheDocument();
        });
    });
});
