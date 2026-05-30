// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CUSTOM_MODEL_VALUE, useModel } from '../hooks/useModel';
import { getModelMode, normalizeModelId } from '../runtime/model';
import { DEFAULT_MODEL_ID } from '../services/openrouter/config';

describe('assistant model runtime', () => {
    it.each([
        ['', DEFAULT_MODEL_ID, 'free'],
        ['  ', DEFAULT_MODEL_ID, 'free'],
        [undefined, DEFAULT_MODEL_ID, 'free'],
        ['anthropic/claude-3.5-sonnet', 'anthropic/claude-3.5-sonnet', 'custom'],
    ])('normalizes %s to %s as %s mode', (value, normalized, mode) => {
        expect(normalizeModelId(value)).toBe(normalized);
        expect(getModelMode(value)).toBe(mode);
    });

    it('selects free and custom modes through shared model controls', () => {
        const setModel = vi.fn();
        const { result } = renderHook(() =>
            useModel({
                commitEmptyCustom: true,
                model: DEFAULT_MODEL_ID,
                restoreCustomOnSelect: false,
                setModel,
            }),
        );

        expect(result.current.mode).toBe('free');
        expect(result.current.selectValue).toBe(DEFAULT_MODEL_ID);

        act(() => result.current.selectMode(CUSTOM_MODEL_VALUE));

        expect(result.current.mode).toBe('custom');
        expect(result.current.panelValue).toBe('');
        expect(setModel).not.toHaveBeenCalled();

        act(() => result.current.updateCustomModel('custom/model'));

        expect(setModel).toHaveBeenLastCalledWith('custom/model');

        act(() => result.current.selectMode('free'));

        expect(result.current.mode).toBe('free');
        expect(setModel).toHaveBeenLastCalledWith(DEFAULT_MODEL_ID);
    });

    it('can commit an empty custom draft for the connection panel', () => {
        const setModel = vi.fn();
        const { result } = renderHook(() =>
            useModel({
                commitEmptyCustom: true,
                model: DEFAULT_MODEL_ID,
                setModel,
            }),
        );

        act(() => result.current.selectCustom());
        act(() => result.current.updateCustomModel(''));

        expect(result.current.mode).toBe('custom');
        expect(setModel).toHaveBeenLastCalledWith('');
    });
});
