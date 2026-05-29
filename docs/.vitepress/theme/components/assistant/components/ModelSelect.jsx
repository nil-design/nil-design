import { Input, Select } from '@nild/components';
import React, { useEffect, useRef, useState } from 'react';
import { useAssistantContext } from '../contexts/AssistantContext';
import { getModelMode, normalizeModelId } from '../runtime/model';
import { DEFAULT_MODEL_ID } from '../services/openrouter/config';

const CUSTOM_MODEL_VALUE = '__custom_model__';

const ModelSelect = ({ disabled }) => {
    const { i18n, locale, model, setModel } = useAssistantContext();
    const [selectedMode, setSelectedMode] = useState(() => getModelMode(model));
    const [customModel, setCustomModel] = useState(() =>
        getModelMode(model) === 'custom' ? normalizeModelId(model) : '',
    );
    const inputRef = useRef(null);
    const modelId = normalizeModelId(model);
    const modelMode = getModelMode(model);
    const customLabel = i18n.t('assistant.openrouter.model.custom', { language: locale });
    const modelLabel = i18n.t('assistant.openrouter.model', { language: locale });

    useEffect(() => {
        if (modelMode === 'custom') {
            setSelectedMode('custom');
            setCustomModel(modelId);
            window.requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));

            return;
        }

        setSelectedMode('free');
    }, [modelId, modelMode]);

    const selectCustomModel = () => {
        setSelectedMode('custom');
        window.requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));

        if (customModel.trim()) {
            setModel(customModel);
        }
    };

    const updateCustomModel = value => {
        const nextModel = String(value);

        setCustomModel(nextModel);
        if (nextModel.trim()) {
            setModel(nextModel);
        }
    };

    return (
        <div className="flex min-w-0 max-w-70 flex-1 items-center gap-2">
            <Select
                aria-label={modelLabel}
                className="nd-assistant-model-select shrink-0 rounded-lg"
                disabled={disabled}
                offset={8}
                placement="top-start"
                size="small"
                value={selectedMode === 'free' ? DEFAULT_MODEL_ID : CUSTOM_MODEL_VALUE}
                variant="filled"
                onChange={value => {
                    if (value === DEFAULT_MODEL_ID) {
                        setSelectedMode('free');
                        setModel(DEFAULT_MODEL_ID);

                        return;
                    }

                    selectCustomModel();
                }}
            >
                <Select.Option value={DEFAULT_MODEL_ID} label={DEFAULT_MODEL_ID} />
                <Select.Option value={CUSTOM_MODEL_VALUE} label={customLabel} />
            </Select>
            {selectedMode === 'custom' && (
                <Input
                    ref={inputRef}
                    aria-label={customLabel}
                    block
                    variant="underlined"
                    className="min-w-0"
                    size="small"
                    value={customModel}
                    disabled={disabled}
                    placeholder={DEFAULT_MODEL_ID}
                    onChange={updateCustomModel}
                />
            )}
        </div>
    );
};

export default ModelSelect;
