// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import SourceList from '../components/SourceList';
import { AssistantProvider } from '../contexts/AssistantContext';

const renderSourceList = ({ navigate = vi.fn(), sources = [] } = {}) => {
    const i18n = {
        t: () => 'References',
    };

    render(
        <AssistantProvider env={{ i18n, locale: 'en-US', navigate }} session={{}} thread={{}}>
            <SourceList sources={sources} />
        </AssistantProvider>,
    );

    return { navigate };
};

describe('assistant source list', () => {
    it('renders section-level source labels and navigates to the section path', () => {
        const { navigate } = renderSourceList({
            sources: [
                {
                    pageTitle: 'Input',
                    sectionTitle: 'API',
                    sectionPath: '/components/input/#api',
                },
            ],
        });

        fireEvent.click(screen.getByRole('button', { name: /\[1\]\. Input · API/u }));

        expect(navigate).toHaveBeenCalledWith('/components/input/#api');
    });
});
