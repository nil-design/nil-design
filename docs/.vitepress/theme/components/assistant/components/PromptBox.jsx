import { Button } from '@nild/components';
import { DynamicIcon } from '@nild/icons';
import { cnJoin } from '@nild/shared';
import React, { useEffect, useRef } from 'react';
import { useAssistantContext } from '../contexts/AssistantContext';
import ModelSelect from './ModelSelect';

const TEXTAREA_MIN_HEIGHT = 44;
const TEXTAREA_MAX_HEIGHT = 136;

const PromptBox = ({ value, disabled, generating, onChange, onSend }) => {
    const { i18n, locale } = useAssistantContext();
    const textareaRef = useRef(null);
    const sendable = !disabled && !generating && value.trim().length > 0;

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        if (!value) {
            textarea.style.height = `${TEXTAREA_MIN_HEIGHT}px`;

            return;
        }

        textarea.style.height = `${TEXTAREA_MIN_HEIGHT}px`;
        textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, TEXTAREA_MIN_HEIGHT), TEXTAREA_MAX_HEIGHT)}px`;
    }, [value]);

    return (
        <div className="mx-4 mb-4 shrink-0 rounded-xl bg-subtle p-3 shadow-sm">
            <textarea
                ref={textareaRef}
                className={cnJoin(
                    'vp-custom-scrollbar block w-full resize-none border-0 p-0 outline-none leading-5.5',
                    'placeholder:text-subtle text-main text-md',
                    'max-h-34 min-h-11 overflow-y-auto',
                    disabled && 'cursor-not-allowed opacity-60',
                )}
                disabled={disabled}
                rows={2}
                value={value}
                placeholder={i18n.t(
                    generating
                        ? 'assistant.input.generating'
                        : disabled
                          ? 'assistant.input.disconnected'
                          : 'assistant.input',
                    { language: locale },
                )}
                onChange={event => onChange(event.target.value)}
                onKeyDown={event => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        if (sendable) {
                            onSend();
                        }
                    }
                }}
            />
            <div className="mt-3 flex h-8 items-end justify-between gap-3">
                <ModelSelect disabled={disabled || generating} />
                <Button
                    equal
                    size="medium"
                    className="rounded-lg"
                    disabled={!sendable}
                    aria-label={i18n.t('assistant.send', { language: locale })}
                    onClick={onSend}
                >
                    <DynamicIcon name="send" variant="filled" />
                </Button>
            </div>
        </div>
    );
};

export default PromptBox;
