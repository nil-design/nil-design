import { useEffect, useRef } from 'react';
import { createStyleSnapshot, matchesStyleSnapshot, restoreStyle } from '../_shared/layer';
import { WatermarkProps, WatermarkTamperEvent } from '../interfaces';
import type { CSSProperties, RefObject } from 'react';

interface UseWatermarkPreserveOptions {
    rootRef: RefObject<HTMLDivElement>;
    layerRef: RefObject<HTMLDivElement>;
    layerClassName: string;
    layerStyle: CSSProperties;
    enabled?: boolean;
    onTamper?: WatermarkProps['onTamper'];
}

interface ExpectedLayerState {
    className: string;
    style: CSSProperties;
    onTamper?: WatermarkProps['onTamper'];
}

const createTamperEvent = (
    $root: HTMLDivElement,
    $layer: HTMLDivElement,
    expected: ExpectedLayerState,
): WatermarkTamperEvent | null => {
    if ($layer.parentNode !== $root) {
        return { type: 'removed' };
    }

    if ($root.lastElementChild !== $layer) {
        return { type: 'reordered' };
    }

    if ($layer.className !== expected.className) {
        return { type: 'attribute', attributeName: 'class' };
    }

    if ($layer.getAttribute('aria-hidden') !== 'true') {
        return { type: 'attribute', attributeName: 'aria-hidden' };
    }

    if ($layer.hidden) {
        return { type: 'attribute', attributeName: 'hidden' };
    }

    if (!matchesStyleSnapshot($layer, createStyleSnapshot(expected.style))) {
        return { type: 'attribute', attributeName: 'style' };
    }

    return null;
};

export const useWatermarkPreserve = (options: UseWatermarkPreserveOptions) => {
    const { rootRef, layerRef, layerClassName, layerStyle, enabled = true, onTamper } = options;
    const expectedRef = useRef<ExpectedLayerState>({
        className: layerClassName,
        style: layerStyle,
        onTamper,
    });

    expectedRef.current = {
        className: layerClassName,
        style: layerStyle,
        onTamper,
    };

    useEffect(() => {
        if (!enabled || typeof MutationObserver === 'undefined') {
            return undefined;
        }

        if (!rootRef.current || !layerRef.current) {
            return undefined;
        }

        let observing = false;
        let cancelScheduled: VoidFunction | null = null;

        const $root = rootRef.current;
        const $layer = layerRef.current;
        const rootObserver = new MutationObserver(scheduleRestore);
        const layerObserver = new MutationObserver(scheduleRestore);

        function observe() {
            if (observing) {
                return;
            }

            rootObserver.observe($root, { childList: true });
            layerObserver.observe($layer, {
                attributes: true,
                attributeFilter: ['aria-hidden', 'class', 'hidden', 'style'],
            });
            observing = true;
        }

        function unobserve() {
            if (!observing) {
                return;
            }

            rootObserver.disconnect();
            layerObserver.disconnect();
            observing = false;
        }

        const restoreLayer = () => {
            const expected = expectedRef.current;
            const tamperEvent = createTamperEvent($root, $layer, expected);

            if (!tamperEvent) {
                return;
            }

            unobserve();
            expected.onTamper?.(tamperEvent);

            if ($layer.parentNode !== $root || $root.lastElementChild !== $layer) {
                $root.appendChild($layer);
            }

            if ($layer.className !== expected.className) {
                $layer.className = expected.className;
            }

            if ($layer.getAttribute('aria-hidden') !== 'true') {
                $layer.setAttribute('aria-hidden', 'true');
            }

            if ($layer.hidden) {
                $layer.hidden = false;
            }

            restoreStyle($layer, expected.style);
            observe();
        };

        function scheduleRestore() {
            if (cancelScheduled) {
                return;
            }

            const run = () => {
                cancelScheduled = null;
                restoreLayer();
            };

            if (typeof requestAnimationFrame === 'function') {
                const rafId = requestAnimationFrame(run);

                cancelScheduled = () => cancelAnimationFrame(rafId);

                return;
            }

            const timeoutId = setTimeout(run);

            cancelScheduled = () => clearTimeout(timeoutId);
        }

        const cancelRestore = () => {
            cancelScheduled?.();
            cancelScheduled = null;
        };

        restoreLayer();
        observe();

        return () => {
            cancelRestore();
            unobserve();
        };
    }, [enabled, layerRef, rootRef]);
};

export default useWatermarkPreserve;
