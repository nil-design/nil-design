export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const HEADING_LEVEL_CLS_MAP: Record<HeadingLevel, string[]> = {
    1: ['text-6xl'],
    2: ['text-5xl'],
    3: ['text-4xl'],
    4: ['text-3xl'],
    5: ['text-2xl'],
    6: ['text-lg'],
};
