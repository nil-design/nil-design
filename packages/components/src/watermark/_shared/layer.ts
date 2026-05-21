import { kebabize } from '@nild/shared';
import type { CSSProperties } from 'react';

export type StyleSnapshot = Record<string, string>;

export const restoreStyle = ($layer: HTMLDivElement, style: CSSProperties) => {
    $layer.removeAttribute('style');

    Object.entries(style).forEach(([property, value]) => {
        if (value != null) {
            $layer.style.setProperty(kebabize(property), String(value));
        }
    });
};

export const createStyleSnapshot = (style: CSSProperties): StyleSnapshot => {
    const $probe = document.createElement('div');

    restoreStyle($probe, style);

    return Object.fromEntries(
        Array.from($probe.style).map(property => [property, $probe.style.getPropertyValue(property)]),
    );
};

export const matchesStyleSnapshot = ($layer: HTMLDivElement, snapshot: StyleSnapshot) => {
    const expectedProperties = Object.keys(snapshot);

    return (
        expectedProperties.every(property => $layer.style.getPropertyValue(property) === snapshot[property]) &&
        Array.from($layer.style).every(property => expectedProperties.includes(property))
    );
};
