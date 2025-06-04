import type { CSSProperties } from 'react';

type CSSPropertiesWithVars = CSSProperties & {
    [key: string]: string | number;
};

export default CSSPropertiesWithVars;
