import { cnJoin } from '@nild/shared';
import { memo } from 'react';
import SourceList from './SourceList';

const Message = ({ message, streaming }) => {
    const userMessage = message.role === 'user';
    const errorMessage = message.status === 'error';

    return (
        <div className={cnJoin('flex', userMessage ? 'justify-end' : 'justify-start')}>
            <div className="max-w-[85%] flex flex-col gap-2">
                <div
                    className={cnJoin(
                        'px-3 py-2 rounded-xl text-md leading-relaxed whitespace-pre-wrap break-words',
                        userMessage
                            ? 'bg-brand text-brand-contrast'
                            : errorMessage
                              ? 'bg-error-subtle text-error'
                              : 'bg-subtle text-main',
                    )}
                >
                    {message.content}
                    {streaming && <span className="inline-block ml-px animate-blink">|</span>}
                </div>
                {!userMessage && <SourceList sources={message.sources} />}
            </div>
        </div>
    );
};

export default memo(Message);
