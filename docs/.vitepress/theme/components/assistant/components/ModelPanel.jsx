import { Input, Segment } from '@nild/components';
import React, { useEffect, useState } from 'react';
import { useAssistantContext } from '../contexts/AssistantContext';
import { getModelMode } from '../runtime/model';
import { DEFAULT_MODEL_ID } from '../services/openrouter/config';

const ModelPanel = ({ disabled }) => {
    const { i18n, locale, model, setModel } = useAssistantContext();
    const [modelMode, setModelMode] = useState(() => getModelMode(model));
    const customValue = modelMode === 'custom' && model === DEFAULT_MODEL_ID ? '' : model;

    useEffect(() => {
        if (model !== DEFAULT_MODEL_ID) {
            setModelMode('custom');
        }
    }, [model]);

    const handleModeChange = value => {
        setModelMode(value);

        if (value === 'free') {
            setModel(DEFAULT_MODEL_ID);
        }
    };

    return (
        <label className="flex flex-col gap-2">
            <span className="text-sm text-subtle">{i18n.t('assistant.openrouter.model', { language: locale })}</span>
            <Segment block size="small" value={modelMode} disabled={disabled} onChange={handleModeChange}>
                <Segment.Item value="free">
                    {i18n.t('assistant.openrouter.model.free', { language: locale })}
                </Segment.Item>
                <Segment.Item value="custom">
                    {i18n.t('assistant.openrouter.model.custom', { language: locale })}
                </Segment.Item>
            </Segment>
            <Input
                block
                size="small"
                value={customValue}
                disabled={disabled || modelMode === 'free'}
                placeholder={DEFAULT_MODEL_ID}
                onChange={value => setModel(String(value))}
            />
        </label>
    );
};

export default ModelPanel;
