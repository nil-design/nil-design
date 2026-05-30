import { Button, Switch, Typography } from '@nild/components';
import { DynamicIcon } from '@nild/icons';
import { memo } from 'react';
import { useEnvContext, useSessionContext } from '../contexts/AssistantContext';
import ModelPanel from './ModelPanel';

const ConnectPanel = () => {
    const { i18n, locale } = useEnvContext();
    const { connect, connecting, error, remember, setRemember } = useSessionContext();

    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-canvas px-5 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <DynamicIcon name="lightning" variant="filled" className="text-[22px]" />
            </div>
            <div className="flex flex-col gap-1.5">
                <Typography.Title className="m-0 text-lg">
                    {i18n.t('assistant.openrouter.connect', { language: locale })}
                </Typography.Title>
                <Typography.Paragraph className="m-0 text-sm text-muted">
                    {i18n.t('assistant.openrouter.description', { language: locale })}
                </Typography.Paragraph>
            </div>
            {error && <p className="m-0 text-sm text-error">{error}</p>}
            <div className="w-full text-left">
                <ModelPanel disabled={connecting} />
            </div>
            <label className="flex w-full items-center justify-between gap-3 text-sm text-muted">
                <span>{i18n.t('assistant.openrouter.remember', { language: locale })}</span>
                <Switch size="small" checked={remember} disabled={connecting} onChange={setRemember} />
            </label>
            <Button block disabled={connecting} onClick={connect}>
                {i18n.t(connecting ? 'assistant.openrouter.connecting' : 'assistant.openrouter.connect.action', {
                    language: locale,
                })}
            </Button>
        </div>
    );
};

export default memo(ConnectPanel);
