import { memo } from 'react';
import { useEnvContext } from '../contexts/AssistantContext';

const SourceList = ({ sources }) => {
    const { i18n, locale, navigate } = useEnvContext();

    if (!sources.length) {
        return null;
    }

    return (
        <div className="px-1 flex flex-col gap-1">
            <p className="text-sm text-subtle">{i18n.t('assistant.sources.title', { language: locale })}</p>
            {sources.map((source, index) => (
                <button
                    className="text-left text-sm leading-5 text-muted underline decoration-transparent underline-offset-2 cursor-pointer hover:text-brand-hover hover:decoration-current"
                    key={source.path}
                    type="button"
                    onClick={() => navigate(source.path)}
                >
                    <span className="text-brand">[{index + 1}]. </span>
                    {source.title}
                </button>
            ))}
        </div>
    );
};

export default memo(SourceList);
