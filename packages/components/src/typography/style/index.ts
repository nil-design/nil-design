export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const headingClassNames: Record<HeadingLevel, string[]> = {
    1: ['text-5xl'],
    2: ['text-4xl'],
    3: ['text-3xl'],
    4: ['text-2xl'],
    5: ['text-xl'],
    6: ['text-lg'],
};
