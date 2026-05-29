import { DynamicIcon } from '@nild/icons';
import { cnJoin } from '@nild/shared';
import React from 'react';
import { useAssistantContext } from '../contexts/AssistantContext';

const Header = ({ onClose, onDragStart }) => {
    const { connected, generating, i18n, locale } = useAssistantContext();

    return (
        <div
            className="flex h-12 shrink-0 cursor-move select-none items-center justify-between gap-3 border-b border-muted bg-subtle px-4"
            data-click-fallback="false"
            onMouseDown={onDragStart}
        >
            <div className="flex min-w-0 items-center gap-2">
                <span
                    className={cnJoin(
                        'h-2 w-2 shrink-0 rounded-full transition-colors',
                        connected ? 'bg-brand' : 'bg-vp-accent-soft',
                        generating && 'animate-pulse',
                    )}
                />
                <span className="text-md font-semibold text-main truncate">
                    {i18n.t('assistant.title', { language: locale })}
                </span>
                {connected && (
                    <span className="shrink-0 rounded bg-muted px-2 py-1 text-xs leading-none text-muted">
                        Powered by OpenRouter
                    </span>
                )}
            </div>
            <button
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-main transition-colors hover:bg-muted-hover"
                aria-label={i18n.t('assistant.close', { language: locale })}
                type="button"
                onMouseDown={event => event.stopPropagation()}
                onClick={onClose}
            >
                <DynamicIcon name="close" variant="filled" />
            </button>
        </div>
    );
};

export default Header;
