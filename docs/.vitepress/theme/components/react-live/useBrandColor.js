import { useSyncExternalStore } from 'react';

const colorCache = new Map();
const subscribers = new Set();
let observer;
let $probe;
let $canvas;
let ctx;

const notifySubscribers = () => {
    colorCache.clear();
    subscribers.forEach(listener => listener());
};

const ensureObserver = () => {
    if (observer || typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
        return;
    }

    observer = new MutationObserver(notifySubscribers);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
};

const getCanvasContext = () => {
    if (typeof document === 'undefined' || !document.body) {
        return;
    }

    if (!$probe) {
        $probe = document.createElement('span');
    }

    if (!$canvas) {
        $canvas = document.createElement('canvas');
        $canvas.width = 1;
        $canvas.height = 1;
        ctx = $canvas.getContext('2d');
    }

    if (!$probe.isConnected) {
        document.body.appendChild($probe);
    }

    return ctx;
};

const resolveBrandColor = (level = 60, alpha) => {
    const key = `${level}:${alpha ?? ''}`;

    if (colorCache.has(key)) {
        return colorCache.get(key);
    }

    const ctx = getCanvasContext();

    if (!ctx) {
        return '';
    }

    $probe.style.color = `var(--nd-color-brand-${level})`;
    ctx.fillStyle = getComputedStyle($probe).color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const toHex = value => value.toString(16).padStart(2, '0');
    const color = typeof alpha === 'number' ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    colorCache.set(key, color);

    return color;
};

const subscribeBrandColor = listener => {
    subscribers.add(listener);
    ensureObserver();

    return () => subscribers.delete(listener);
};

const useBrandColor = (level = 60, alpha) =>
    useSyncExternalStore(
        subscribeBrandColor,
        () => resolveBrandColor(level, alpha),
        () => '',
    );

export default useBrandColor;
