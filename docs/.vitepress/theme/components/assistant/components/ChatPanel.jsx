import React from 'react';
import { useSessionContext, useThreadContext } from '../contexts/AssistantContext';
import { useAutoScroll } from '../hooks/useAutoScroll';
import EmptyState from './EmptyState';
import Message from './Message';
import PromptBox from './PromptBox';

const ChatPanel = () => {
    const { connected } = useSessionContext();
    const { contextWarning, generating, messages, prompt, send, setPrompt } = useThreadContext();
    const { onScroll, scrollRef } = useAutoScroll({
        resetKey: messages.length,
        watch: messages,
    });

    return (
        <div className="relative flex min-h-0 flex-1 flex-col bg-canvas">
            <div
                ref={scrollRef}
                className="vp-custom-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-canvas p-4"
                onScroll={onScroll}
            >
                {contextWarning && (
                    <p className="m-0 rounded-lg bg-warning-subtle px-3 py-2 text-sm text-muted">{contextWarning}</p>
                )}
                {messages.length === 0 ? (
                    <EmptyState />
                ) : (
                    messages.map((message, index) => (
                        <Message
                            key={message.id}
                            message={message}
                            streaming={generating && index === messages.length - 1}
                        />
                    ))
                )}
            </div>
            <PromptBox
                disabled={!connected || generating}
                generating={generating}
                value={prompt}
                onChange={setPrompt}
                onSend={send}
            />
        </div>
    );
};

export default ChatPanel;
