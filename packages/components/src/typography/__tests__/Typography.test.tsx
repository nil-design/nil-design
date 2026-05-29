import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import Typography from '..';
import { Typography as RootTypography } from '../../index';

describe('Typography', () => {
    it('is exported from the package root with compound members', () => {
        expect(RootTypography).toBe(Typography);
        expect(Typography.Link).toBeDefined();
        expect(Typography.Paragraph).toBeDefined();
        expect(Typography.Text).toBeDefined();
        expect(Typography.Title).toBeDefined();
    });

    it('renders an article and forwards props and ref', () => {
        const ref = createRef<HTMLElement>();

        render(
            <Typography aria-label="article" data-kind="copy" ref={ref}>
                Body copy
            </Typography>,
        );

        const article = screen.getByRole('article', { name: 'article' });

        expect(article).toHaveTextContent('Body copy');
        expect(article).toHaveAttribute('data-kind', 'copy');
        expect(ref.current).toBe(article);
    });

    it('renders title levels as matching headings', () => {
        render(<Typography.Title level={3}>Section title</Typography.Title>);

        expect(screen.getByRole('heading', { level: 3, name: 'Section title' })).toBeInTheDocument();
    });

    it('wraps text with unique semantic tags', () => {
        const { container } = render(
            <Typography.Text tags={['strong', 'strong', 'code']}>Important code</Typography.Text>,
        );

        expect(container.querySelectorAll('strong')).toHaveLength(1);
        expect(container.querySelectorAll('code')).toHaveLength(1);
        expect(screen.getByText('Important code')).toBeInTheDocument();
    });

    it('marks disabled text through aria-disabled', () => {
        render(<Typography.Text disabled>Muted</Typography.Text>);

        expect(screen.getByText('Muted')).toHaveAttribute('aria-disabled', 'true');
    });

    it('resolves link href and disabled semantics', () => {
        const { rerender } = render(<Typography.Link>Docs</Typography.Link>);

        expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '#');

        rerender(<Typography.Link href="/guide">Docs</Typography.Link>);

        expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/guide');

        rerender(
            <Typography.Link disabled href="/guide">
                Docs
            </Typography.Link>,
        );

        const link = screen.getByText('Docs');

        expect(link).toHaveAttribute('aria-disabled', 'true');
        expect(link).not.toHaveAttribute('href');
    });

    it('renders paragraph content and forwards props and ref', () => {
        const ref = createRef<HTMLParagraphElement>();

        render(
            <Typography.Paragraph data-kind="paragraph" ref={ref}>
                Paragraph copy
            </Typography.Paragraph>,
        );

        expect(screen.getByText('Paragraph copy')).toHaveAttribute('data-kind', 'paragraph');
        expect(ref.current).toBe(screen.getByText('Paragraph copy'));
    });
});
