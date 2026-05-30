// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSession } from '../hooks/useSession';
import { STORAGE_KEY, saveSession } from '../services/openrouter/session';

describe('assistant session runtime', () => {
    beforeEach(() => {
        window.history.replaceState({}, '', '/');
        window.localStorage.clear();
        window.sessionStorage.clear();
        vi.clearAllMocks();
    });

    it('persists model and remember changes through the loaded session', () => {
        saveSession({ key: 'sk-test', model: 'openrouter/free', remember: false });

        const service = {
            buildAuthUrl: vi.fn(),
            clearPendingAuth: vi.fn(),
            completeAuthCallback: vi.fn(),
            removeAuthParams: vi.fn(),
        };
        const { result } = renderHook(() => useSession({ locale: 'en-US', service }));

        act(() => result.current.setModel('custom/model'));
        expect(JSON.parse(window.sessionStorage.getItem(STORAGE_KEY))).toMatchObject({
            key: 'sk-test',
            model: 'custom/model',
        });

        act(() => result.current.setRemember(true));
        expect(window.sessionStorage.getItem(STORAGE_KEY)).toBeNull();
        expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY))).toMatchObject({
            key: 'sk-test',
            model: 'custom/model',
            remember: true,
        });
    });

    it('completes an OAuth callback and opens the panel', async () => {
        window.history.replaceState({}, '', '/?code=code&state=state');

        const onOpen = vi.fn();
        const service = {
            buildAuthUrl: vi.fn(),
            clearPendingAuth: vi.fn(),
            completeAuthCallback: vi.fn().mockResolvedValue('sk-callback'),
            removeAuthParams: vi.fn(),
        };
        const { result } = renderHook(() => useSession({ locale: 'en-US', onOpen, service }));

        await waitFor(() => expect(result.current.connected).toBe(true));

        expect(onOpen).toHaveBeenCalledTimes(1);
        expect(service.completeAuthCallback).toHaveBeenCalledTimes(1);
        expect(service.removeAuthParams).toHaveBeenCalledTimes(1);
        expect(JSON.parse(window.sessionStorage.getItem(STORAGE_KEY))).toMatchObject({
            key: 'sk-callback',
        });
    });

    it('clears auth state and stored session on disconnect', () => {
        saveSession({ key: 'sk-test', remember: true });

        const service = {
            buildAuthUrl: vi.fn(),
            clearPendingAuth: vi.fn(),
            completeAuthCallback: vi.fn(),
            removeAuthParams: vi.fn(),
        };
        const { result } = renderHook(() => useSession({ locale: 'en-US', service }));

        act(() => result.current.disconnect());

        expect(result.current.connected).toBe(false);
        expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
        expect(window.sessionStorage.getItem(STORAGE_KEY)).toBeNull();
        expect(service.clearPendingAuth).toHaveBeenCalledTimes(1);
        expect(service.removeAuthParams).toHaveBeenCalledTimes(1);
    });
});
