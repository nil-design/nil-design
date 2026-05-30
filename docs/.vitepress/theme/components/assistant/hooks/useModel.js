import { useCallback, useEffect, useMemo, useState } from 'react';
import { getModelMode, normalizeModelId } from '../runtime/model';
import { DEFAULT_MODEL_ID } from '../services/openrouter/config';

export const CUSTOM_MODEL_VALUE = '__custom_model__';

export const useModel = ({ commitEmptyCustom = false, model, restoreCustomOnSelect = true, setModel }) => {
    const [mode, setMode] = useState(() => getModelMode(model));
    const [customModel, setCustomModel] = useState(() =>
        getModelMode(model) === 'custom' ? normalizeModelId(model) : '',
    );
    const modelId = normalizeModelId(model);
    const modelMode = getModelMode(model);

    useEffect(() => {
        if (!`${model || ''}`) {
            return;
        }
        if (modelMode === 'custom') {
            setMode('custom');
            setCustomModel(modelId);

            return;
        }

        setMode('free');
    }, [model, modelId, modelMode]);

    const selectFree = useCallback(() => {
        setMode('free');
        setModel(DEFAULT_MODEL_ID);
    }, [setModel]);

    const selectCustom = useCallback(() => {
        setMode('custom');

        if (restoreCustomOnSelect && customModel.trim()) {
            setModel(customModel);
        }
    }, [customModel, restoreCustomOnSelect, setModel]);

    const selectMode = useCallback(
        value => {
            if (value === 'free' || value === DEFAULT_MODEL_ID) {
                selectFree();

                return;
            }

            selectCustom();
        },
        [selectCustom, selectFree],
    );

    const updateCustomModel = useCallback(
        value => {
            const nextModel = String(value);

            setCustomModel(nextModel);
            if (nextModel.trim() || commitEmptyCustom) {
                setModel(nextModel);
            }
        },
        [commitEmptyCustom, setModel],
    );

    return useMemo(
        () => ({
            customModel,
            mode,
            panelValue: mode === 'custom' && modelId === DEFAULT_MODEL_ID ? '' : modelId,
            selectCustom,
            selectFree,
            selectMode,
            selectValue: mode === 'free' ? DEFAULT_MODEL_ID : CUSTOM_MODEL_VALUE,
            updateCustomModel,
        }),
        [customModel, mode, modelId, selectCustom, selectFree, selectMode, updateCustomModel],
    );
};
