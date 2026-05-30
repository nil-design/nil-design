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

export const getRouteSegments = routePath =>
    `${routePath || ''}`
        .split(/[?#]/u)[0]
        .replace(/\/index\.html$/u, '/')
        .replace(/\.html$/u, '')
        .split('/')
        .filter(Boolean);

export const getSuggestionGroup = routePath => {
    const segments = getRouteSegments(routePath);
    const groupIndex = segments.findIndex(segment => segment === 'components' || segment === 'hooks');
    const subjectSegment = segments[groupIndex + 1];

    if (groupIndex < 0 || !subjectSegment || subjectSegment === 'index') {
        return null;
    }

    return segments[groupIndex] === 'components' ? 'COMPONENT' : 'HOOK';
};

export const getPageSubject = (root = typeof document === 'undefined' ? null : document) => {
    const $heading = root?.querySelector?.('.vp-doc h1');
    const $subject = $heading?.cloneNode(true);

    $subject?.querySelectorAll('a').forEach($link => $link.remove());

    return $subject?.textContent?.replace(/\s+/g, ' ').trim() || '';
};

export const shuffle = (values, random = Math.random) => {
    const nextValues = [...values];

    for (let index = nextValues.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        const currentValue = nextValues[index];

        nextValues[index] = nextValues[swapIndex];
        nextValues[swapIndex] = currentValue;
    }

    return nextValues;
};

export const createSuggestions = ({ i18n, locale, random, routePath, subject = getPageSubject() }) => {
    const group = getSuggestionGroup(routePath);

    if (!group || !subject) {
        return [];
    }

    return shuffle(
        SUGGESTION_KEYS[group].map(key =>
            i18n.t(key, {
                language: locale,
                parameters: { subject },
            }),
        ),
        random,
    ).slice(0, 3);
};
