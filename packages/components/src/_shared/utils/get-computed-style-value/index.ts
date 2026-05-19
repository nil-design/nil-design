type ComputedStyleKey = Extract<
    {
        [Key in keyof CSSStyleDeclaration]: CSSStyleDeclaration[Key] extends string ? Key : never;
    }[keyof CSSStyleDeclaration],
    string
>;
type ComputedStyleGetter = ComputedStyleKey | ((style: CSSStyleDeclaration) => string | undefined);

function getComputedStyleValue(element: HTMLElement | null, key: ComputedStyleKey): string | undefined;
function getComputedStyleValue(
    element: HTMLElement | null,
    getter: (style: CSSStyleDeclaration) => string | undefined,
): string | undefined;
function getComputedStyleValue(element: HTMLElement | null, getter: ComputedStyleGetter) {
    if (!element || typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
        return undefined;
    }

    const style = window.getComputedStyle(element);

    return typeof getter === 'function' ? getter(style) : style[getter];
}

export default getComputedStyleValue;
