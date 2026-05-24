import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Tabs from '..';
import { Tabs as RootTabs } from '../../index';

const renderPanels = () => (
    <>
        <Tabs.Panel value="profile">Profile panel</Tabs.Panel>
        <Tabs.Panel value="security">Security panel</Tabs.Panel>
        <Tabs.Panel value="billing">Billing panel</Tabs.Panel>
    </>
);

describe('Tabs', () => {
    beforeEach(() => {
        vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
            callback(0);

            return 0;
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('is exported from the package root', () => {
        expect(RootTabs).toBe(Tabs);
    });

    it('selects the first enabled tab by default and collects fragment tabs in order', () => {
        render(
            <Tabs>
                <Tabs.List>
                    <>
                        <Tabs.Tab value="profile">Profile</Tabs.Tab>
                    </>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                </Tabs.List>
                {renderPanels()}
            </Tabs>,
        );

        const tabs = screen.getAllByRole('tab');

        expect(tabs[0]).toHaveTextContent('Profile');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
        expect(screen.getByText('Profile panel').closest('[role="tabpanel"]')).not.toHaveAttribute('hidden');
        expect(screen.getByText('Security panel').closest('[role="tabpanel"]')).toHaveAttribute('hidden');
    });

    it('supports controlled values and skips disabled tabs during automatic keyboard activation', () => {
        const Demo = () => {
            const [value, setValue] = useState('profile');

            return (
                <Tabs value={value} onChange={setValue}>
                    <Tabs.List>
                        <Tabs.Tab value="profile">Profile</Tabs.Tab>
                        <Tabs.Tab value="security" disabled>
                            Security
                        </Tabs.Tab>
                        <Tabs.Tab value="billing">Billing</Tabs.Tab>
                    </Tabs.List>
                    {renderPanels()}
                </Tabs>
            );
        };

        render(<Demo />);

        const list = screen.getByRole('tablist');
        const billingTab = screen.getByRole('tab', { name: 'Billing' });

        fireEvent.keyDown(list, { key: 'ArrowRight' });

        expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'false');
        expect(billingTab).toHaveAttribute('aria-selected', 'true');
        expect(billingTab).toHaveFocus();
        expect(screen.getByText('Billing panel').closest('[role="tabpanel"]')).not.toHaveAttribute('hidden');
    });

    it('keeps keyboard movement separate from selection when activation is manual', () => {
        render(
            <Tabs activation="manual" defaultValue="profile">
                <Tabs.List>
                    <Tabs.Tab value="profile">Profile</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                    <Tabs.Tab value="billing">Billing</Tabs.Tab>
                </Tabs.List>
                {renderPanels()}
            </Tabs>,
        );

        const list = screen.getByRole('tablist');
        const securityTab = screen.getByRole('tab', { name: 'Security' });

        fireEvent.keyDown(list, { key: 'ArrowRight' });

        expect(securityTab).toHaveFocus();
        expect(securityTab).toHaveAttribute('aria-selected', 'false');
        expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');

        fireEvent.keyDown(list, { key: 'Enter' });

        expect(securityTab).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Security panel').closest('[role="tabpanel"]')).not.toHaveAttribute('hidden');
    });

    it('supports Home, End and vertical arrow navigation', () => {
        render(
            <Tabs defaultValue="security" orientation="vertical">
                <Tabs.List>
                    <Tabs.Tab value="profile">Profile</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                    <Tabs.Tab value="billing">Billing</Tabs.Tab>
                </Tabs.List>
                {renderPanels()}
            </Tabs>,
        );

        const list = screen.getByRole('tablist');

        expect(list).toHaveAttribute('aria-orientation', 'vertical');

        fireEvent.keyDown(list, { key: 'End' });
        expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');

        fireEvent.keyDown(list, { key: 'ArrowUp' });
        expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'true');

        fireEvent.keyDown(list, { key: 'Home' });
        expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
    });

    it('applies card, size and orientation classes', () => {
        render(
            <Tabs defaultValue="profile" orientation="vertical" size="large" variant="card">
                <Tabs.List>
                    <Tabs.Tab value="profile">Profile</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="profile">Profile panel</Tabs.Panel>
                <Tabs.Panel value="security">Security panel</Tabs.Panel>
            </Tabs>,
        );

        const list = screen.getByRole('tablist');
        const selectedTab = screen.getByRole('tab', { name: 'Profile' });
        const $panel = screen.getByText('Profile panel').closest('[role="tabpanel"]');

        expect(list).toHaveClass('flex-col');
        expect(selectedTab).toHaveClass('bg-panel');
        expect(selectedTab).toHaveClass('text-lg');
        expect($panel).toHaveClass('border');
        expect($panel).toHaveClass('rounded-r-md');
    });

    it('does not move selection from keyboard when root is disabled', () => {
        const onChange = vi.fn();

        render(
            <Tabs defaultValue="profile" disabled onChange={onChange}>
                <Tabs.List>
                    <Tabs.Tab value="profile">Profile</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                </Tabs.List>
                {renderPanels()}
            </Tabs>,
        );

        fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });

        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute('aria-selected', 'false');
    });

    it('emits close events without changing value or removing content', () => {
        const onChange = vi.fn();
        const onClose = vi.fn();

        render(
            <Tabs closable defaultValue="profile" onChange={onChange} onClose={onClose}>
                <Tabs.List>
                    <Tabs.Tab value="profile">Profile</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                </Tabs.List>
                {renderPanels()}
            </Tabs>,
        );

        const closeButton = screen.getAllByRole('button', { name: 'Close tab' })[0];

        expect(closeButton).toHaveClass('cursor-pointer');

        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onClose.mock.calls[0][0]).toBe('profile');
        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Profile panel')).toBeInTheDocument();
    });

    it('keeps inactive panels mounted by default and destroys them when requested', () => {
        const { rerender } = render(
            <Tabs defaultValue="profile">
                <Tabs.List>
                    <Tabs.Tab value="profile">Profile</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="profile">Profile panel</Tabs.Panel>
                <Tabs.Panel value="security">Security panel</Tabs.Panel>
            </Tabs>,
        );

        expect(screen.getByText('Security panel').closest('[role="tabpanel"]')).toHaveAttribute('hidden');

        rerender(
            <Tabs defaultValue="profile" destroyOnInactive>
                <Tabs.List>
                    <Tabs.Tab value="profile">Profile</Tabs.Tab>
                    <Tabs.Tab value="security">Security</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="profile">Profile panel</Tabs.Panel>
                <Tabs.Panel value="security">Security panel</Tabs.Panel>
            </Tabs>,
        );

        expect(screen.queryByText('Security panel')).not.toBeInTheDocument();
    });
});
