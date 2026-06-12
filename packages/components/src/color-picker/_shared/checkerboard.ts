import type { CSSProperties } from 'react';

export type CheckerboardStyle = CSSProperties & {
    '--nd-color-picker-checker-base'?: string;
    '--nd-color-picker-checker-color'?: string;
};

const checkerboardImage =
    'conic-gradient(var(--nd-color-picker-checker-color) 25%,transparent 0 50%,var(--nd-color-picker-checker-color) 0 75%,transparent 0)';

const checkerboardPosition = '0 0';
const checkerboardSize = '0.5rem 0.5rem';

export const CHECKERBOARD_STYLE: CheckerboardStyle = {
    '--nd-color-picker-checker-base': 'var(--background-color-canvas)',
    '--nd-color-picker-checker-color':
        'color-mix(in oklch,var(--background-color-muted) 72%,var(--background-color-canvas))',
    backgroundColor: 'var(--nd-color-picker-checker-base)',
    backgroundImage: checkerboardImage,
    backgroundPosition: checkerboardPosition,
    backgroundRepeat: 'repeat',
    backgroundSize: checkerboardSize,
};

export const getCheckerboardStyle = (overlayImage?: string): CheckerboardStyle => {
    if (!overlayImage) {
        return CHECKERBOARD_STYLE;
    }

    return {
        ...CHECKERBOARD_STYLE,
        backgroundImage: `${overlayImage},${checkerboardImage}`,
        backgroundPosition: `0 0,${checkerboardPosition}`,
        backgroundRepeat: 'no-repeat,repeat',
        backgroundSize: `100% 100%,${checkerboardSize}`,
    };
};
