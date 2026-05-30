import { Input, Select } from '@nild/components';
import { memo, useEffect, useRef } from 'react';
import { useEnvContext, useSessionContext } from '../contexts/AssistantContext';
import { CUSTOM_MODEL_VALUE, useModel } from '../hooks/useModel';
import { DEFAULT_MODEL_ID } from '../services/openrouter/config';

const ModelSelect = ({ disabled }) => {
    const { i18n, locale } = useEnvContext();
    const { model, setModel } = useSessionContext();
    const modelControl = useModel({ model, setModel });
    const inputRef = useRef(null);
    const customLabel = i18n.t('assistant.openrouter.model.custom', { language: locale });
    const modelLabel = i18n.t('assistant.openrouter.model', { language: locale });

    useEffect(() => {
        if (modelControl.mode === 'custom') {
            window.requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
        }
    }, [modelControl.mode]);

    return (
        <div className="flex min-w-0 max-w-70 flex-1 items-center gap-2">
            <Select
                aria-label={modelLabel}
                className="nd-assistant-model-select shrink-0 rounded-lg"
                disabled={disabled}
                offset={8}
                placement="top-start"
                size="small"
                value={modelControl.selectValue}
                variant="filled"
                onChange={modelControl.selectMode}
            >
                <Select.Option value={DEFAULT_MODEL_ID} label={DEFAULT_MODEL_ID} />
                <Select.Option value={CUSTOM_MODEL_VALUE} label={customLabel} />
            </Select>
            {modelControl.mode === 'custom' && (
                <Input
                    ref={inputRef}
                    aria-label={customLabel}
                    block
                    variant="underlined"
                    className="min-w-0"
                    size="small"
                    value={modelControl.customModel}
                    disabled={disabled}
                    placeholder={DEFAULT_MODEL_ID}
                    onChange={modelControl.updateCustomModel}
                />
            )}
        </div>
    );
};

export default memo(ModelSelect);
