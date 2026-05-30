import { Input, Segment } from '@nild/components';
import { memo } from 'react';
import { useEnvContext, useSessionContext } from '../contexts/AssistantContext';
import { useModel } from '../hooks/useModel';
import { DEFAULT_MODEL_ID } from '../services/openrouter/config';

const ModelPanel = ({ disabled }) => {
    const { i18n, locale } = useEnvContext();
    const { model, setModel } = useSessionContext();
    const modelControl = useModel({
        commitEmptyCustom: true,
        model,
        restoreCustomOnSelect: false,
        setModel,
    });

    return (
        <label className="flex flex-col gap-2">
            <span className="text-sm text-subtle">{i18n.t('assistant.openrouter.model', { language: locale })}</span>
            <Segment
                block
                size="small"
                value={modelControl.mode}
                disabled={disabled}
                onChange={modelControl.selectMode}
            >
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
                value={modelControl.panelValue}
                disabled={disabled || modelControl.mode === 'free'}
                placeholder={DEFAULT_MODEL_ID}
                onChange={modelControl.updateCustomModel}
            />
        </label>
    );
};

export default memo(ModelPanel);
