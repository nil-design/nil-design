import { DynamicIcon } from '@nild/icons';
import { cnMerge } from '@nild/shared';
import React, { useCallback, useMemo } from 'react';
import i18n from '../../../../../locales/index';
import ChatPanel from './components/ChatPanel';
import ConnectPanel from './components/ConnectPanel';
import Header from './components/Header';
import { AssistantProvider } from './contexts/AssistantContext';
import { useFloatingPanel } from './hooks/useFloatingPanel';
import { useSession } from './hooks/useSession';
import { useThread } from './hooks/useThread';

const Assistant = ({ locale = 'zh-CN', base = '/', routePath = '', navigate }) => {
    const panel = useFloatingPanel();
    const session = useSession({
        locale,
        onOpen: panel.openPanel,
    });
    const thread = useThread({
        base,
        clearError: session.clearError,
        connected: session.connected,
        key: session.key,
        locale,
        model: session.model,
    });
    const { disconnect: disconnectSession } = session;
    const { reset: resetThread } = thread;

    const disconnect = useCallback(() => {
        resetThread();
        disconnectSession();
    }, [disconnectSession, resetThread]);

    const envValue = useMemo(
        () => ({
            i18n,
            locale,
            navigate,
            routePath,
        }),
        [locale, navigate, routePath],
    );

    const sessionValue = useMemo(
        () => ({
            connected: session.connected,
            connecting: session.connecting,
            error: session.error,
            model: session.model,
            remember: session.remember,
            connect: session.connect,
            disconnect,
            setModel: session.setModel,
            setRemember: session.setRemember,
        }),
        [
            disconnect,
            session.connect,
            session.connected,
            session.connecting,
            session.error,
            session.model,
            session.remember,
            session.setModel,
            session.setRemember,
        ],
    );

    const threadValue = useMemo(
        () => ({
            contextWarning: thread.contextWarning,
            generating: thread.generating,
            messages: thread.messages,
            prompt: thread.prompt,
            send: thread.send,
            setPrompt: thread.setPrompt,
        }),
        [thread.contextWarning, thread.generating, thread.messages, thread.prompt, thread.send, thread.setPrompt],
    );

    if (!panel.mounted) {
        return null;
    }

    return (
        <AssistantProvider env={envValue} session={sessionValue} thread={threadValue}>
            <div
                className={cnMerge(
                    'nd-assistant-root vp-raw fixed z-39 overflow-hidden font-nd shadow-2xl will-change-[left,top,width,height,border-radius]',
                    panel.dragging
                        ? 'transition-none'
                        : 'transition-[left,top,width,height,border-radius,background-color] ease-[cubic-bezier(0.2,0.85,0.25,1)]',
                    panel.opened ? 'rounded-xl' : 'rounded-2xl',
                )}
                style={{
                    left: panel.position.x,
                    top: panel.position.y,
                    width: panel.size.w,
                    height: panel.size.h,
                }}
            >
                <div
                    className={cnMerge(
                        'absolute inset-0 flex origin-bottom-right flex-col bg-subtle text-main transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]',
                        panel.opened
                            ? 'pointer-events-auto scale-100 opacity-100 delay-75'
                            : 'pointer-events-none scale-95 opacity-0',
                    )}
                    aria-hidden={!panel.opened}
                    inert={panel.opened ? undefined : ''}
                >
                    <Header onClose={panel.toggleOpen} onDragStart={panel.onDragStart} />
                    {!session.connected ? <ConnectPanel /> : <ChatPanel />}
                </div>
                <button
                    className={cnMerge(
                        'absolute inset-0 flex items-center justify-center bg-vp-accent-soft text-brand transition-[opacity,transform,background-color] ease-out cursor-pointer select-none hover:text-brand-hover active:text-brand-active',
                        panel.opened ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100',
                    )}
                    type="button"
                    aria-label={i18n.t('assistant.open', { language: locale })}
                    aria-hidden={panel.opened}
                    tabIndex={panel.opened ? -1 : undefined}
                    onMouseDown={panel.onDragStart}
                >
                    <DynamicIcon name="message" variant="filled" className="text-[22px]" />
                </button>
            </div>
        </AssistantProvider>
    );
};

export default Assistant;
