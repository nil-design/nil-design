import { CSSProperties } from 'react';

export type CSSPropertiesWithVars = CSSProperties & {
    [key: string]: string;
};
