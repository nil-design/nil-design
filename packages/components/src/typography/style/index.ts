export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const headingClassNames: Record<HeadingLevel, string[]> = {
    1: ['nd-text-5xl'],
    2: ['nd-text-4xl'],
    3: ['nd-text-3xl'],
    4: ['nd-text-2xl'],
    5: ['nd-text-xl'],
    6: ['nd-text-lg'],
};
