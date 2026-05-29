import { DynamicIcon } from '@nild/icons';
import React from 'react';
import { useAssistantContext } from '../contexts/AssistantContext';

const SUGGESTION_KEYS = {
    COMPONENT: [
        'assistant.suggestion.component.use',
        'assistant.suggestion.component.props',
        'assistant.suggestion.component.example',
        'assistant.suggestion.component.disabled',
        'assistant.suggestion.component.composition',
    ],
    HOOK: [
        'assistant.suggestion.hook.use',
        'assistant.suggestion.hook.params',
        'assistant.suggestion.hook.example',
        'assistant.suggestion.hook.returns',
        'assistant.suggestion.hook.scenarios',
    ],
};

const getRouteSegments = routePath =>
    `${routePath || ''}`
        .split(/[?#]/u)[0]
        .replace(/\/index\.html$/u, '/')
        .replace(/\.html$/u, '')
        .split('/')
        .filter(Boolean);

const getSuggestionGroup = routePath => {
    const segments = getRouteSegments(routePath);
    const groupIndex = segments.findIndex(segment => segment === 'components' || segment === 'hooks');
    const subjectSegment = segments[groupIndex + 1];

    if (groupIndex < 0 || !subjectSegment || subjectSegment === 'index') {
        return null;
    }

    return segments[groupIndex] === 'components' ? 'COMPONENT' : 'HOOK';
};

const getPageSubject = () => {
    if (typeof document === 'undefined') {
        return '';
    }

    const $heading = document.querySelector('.vp-doc h1');
    const $subject = $heading?.cloneNode(true);

    $subject?.querySelectorAll('a').forEach($link => $link.remove());

    const subject = $subject?.textContent?.replace(/\s+/g, ' ').trim();

    if (subject) {
        return subject;
    }

    return '';
};

const shuffle = values => {
    const nextValues = [...values];

    for (let index = nextValues.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const currentValue = nextValues[index];

        nextValues[index] = nextValues[swapIndex];
        nextValues[swapIndex] = currentValue;
    }

    return nextValues;
};

const createSuggestions = (i18n, locale, routePath) => {
    const group = getSuggestionGroup(routePath);

    if (!group) {
        return [];
    }

    const subject = getPageSubject();

    if (!subject) {
        return [];
    }

    const suggestions = SUGGESTION_KEYS[group].map(key =>
        i18n.t(key, {
            language: locale,
            parameters: { subject },
        }),
    );

    return shuffle(suggestions).slice(0, 3);
};

const EmptyState = () => {
    const { i18n, locale, routePath, setPrompt } = useAssistantContext();
    const [suggestions, setSuggestions] = React.useState([]);

    React.useEffect(() => {
        if (typeof window === 'undefined') {
            setSuggestions(createSuggestions(i18n, locale, routePath));

            return undefined;
        }

        const frameId = window.requestAnimationFrame(() => {
            setSuggestions(createSuggestions(i18n, locale, routePath));
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [i18n, locale, routePath]);

    return (
        <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <div className="size-10 rounded-xl bg-vp-accent-soft text-brand flex items-center justify-center">
                <DynamicIcon name="message" variant="filled" className="text-[22px]" />
            </div>
            <p className="m-0 text-md text-subtle">{i18n.t('assistant.empty', { language: locale })}</p>
            {suggestions.length > 0 && (
                <div className="flex max-w-74 flex-wrap justify-center gap-1.5">
                    {suggestions.map(suggestion => (
                        <button
                            key={suggestion}
                            className="h-6 rounded-md bg-muted px-2 text-sm leading-6 text-muted transition-colors cursor-pointer hover:bg-muted-hover hover:text-main"
                            type="button"
                            onClick={() => setPrompt(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
