import React, { useEffect, useRef } from 'react';
import { useAssistantContext } from '../contexts/AssistantContext';
import EmptyState from './EmptyState';
import Message from './Message';
import PromptBox from './PromptBox';

const ChatPanel = () => {
    const { connected, contextWarning, generating, messages, prompt, send, setPrompt } = useAssistantContext();
    const listRef = useRef(null);

    useEffect(() => {
        if (!listRef.current) {
            return;
        }

        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages]);

    return (
        <div className="relative flex min-h-0 flex-1 flex-col bg-canvas">
            <div
                ref={listRef}
                className="vp-custom-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-canvas p-4"
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
