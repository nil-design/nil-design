import { useCallback, useEffect, useState } from 'react';
import { useDraggable } from './useDraggable';

const TRIGGER_SIZE = { w: 48, h: 48 };
const MAX_DIALOG_SIZE = { w: 380, h: 560 };
const SAFE_PADDING = 16;

const clampValue = (value, min, max) => Math.max(min, Math.min(value, max));

const getDialogSize = viewport => ({
    w: Math.min(
        MAX_DIALOG_SIZE.w,
        viewport.w > SAFE_PADDING * 2 ? Math.max(TRIGGER_SIZE.w, viewport.w - SAFE_PADDING * 2) : MAX_DIALOG_SIZE.w,
    ),
    h: Math.min(
        MAX_DIALOG_SIZE.h,
        viewport.h > SAFE_PADDING * 2 ? Math.max(TRIGGER_SIZE.h, viewport.h - SAFE_PADDING * 2) : MAX_DIALOG_SIZE.h,
    ),
});

const getViewport = () => {
    if (typeof window === 'undefined') {
        return { w: 0, h: 0 };
    }

    return { w: window.innerWidth, h: window.innerHeight };
};

const getInitialPosition = viewport => ({
    x: Math.max(SAFE_PADDING, viewport.w - TRIGGER_SIZE.w - SAFE_PADDING),
    y: Math.max(SAFE_PADDING, viewport.h - TRIGGER_SIZE.h - SAFE_PADDING),
});

const getClampedPosition = ({ x, y, opened, viewport }) => {
    const targetSize = opened ? getDialogSize(viewport) : TRIGGER_SIZE;
    const maxX = Math.max(SAFE_PADDING, viewport.w - targetSize.w - SAFE_PADDING);
    const maxY = Math.max(SAFE_PADDING, viewport.h - targetSize.h - SAFE_PADDING);

    return {
        x: clampValue(x, SAFE_PADDING, maxX),
        y: clampValue(y, SAFE_PADDING, maxY),
    };
};

const getAnchorOffset = (opened, dialogSize) => {
    if (!opened) {
        return {
            x: TRIGGER_SIZE.w / 2,
            y: TRIGGER_SIZE.h / 2,
        };
    }

    return {
        x: dialogSize.w - TRIGGER_SIZE.w / 2,
        y: dialogSize.h - TRIGGER_SIZE.h / 2,
    };
};

export const useFloatingPanel = () => {
    const [mounted, setMounted] = useState(false);
    const [opened, setOpened] = useState(false);
    const [viewport, setViewport] = useState(getViewport);
    const [position, setPosition] = useState(() => getInitialPosition(getViewport()));
    const dialogSize = getDialogSize(viewport);
    const size = opened ? dialogSize : TRIGGER_SIZE;

    const clampPosition = useCallback(
        (x, y, targetOpened = opened, targetViewport = viewport) =>
            getClampedPosition({
                x,
                y,
                opened: targetOpened,
                viewport: targetViewport,
            }),
        [opened, viewport],
    );

    const setOpen = useCallback(
        nextOpened => {
            setPosition(current => {
                const currentAnchor = getAnchorOffset(opened, dialogSize);
                const nextAnchor = getAnchorOffset(nextOpened, dialogSize);
                const originX = current.x + currentAnchor.x;
                const originY = current.y + currentAnchor.y;

                return clampPosition(originX - nextAnchor.x, originY - nextAnchor.y, nextOpened);
            });
            setOpened(nextOpened);
        },
        [clampPosition, dialogSize, opened],
    );

    const toggleOpen = useCallback(() => {
        setOpen(!opened);
    }, [opened, setOpen]);

    const openPanel = useCallback(() => {
        setOpen(true);
    }, [setOpen]);

    const dragClamp = useCallback((x, y) => clampPosition(x, y, opened), [clampPosition, opened]);

    const { dragging, onDragStart } = useDraggable({
        position,
        setPosition,
        clamp: dragClamp,
        onClick: toggleOpen,
    });

    useEffect(() => {
        setMounted(true);

        const updateViewport = () => {
            const nextViewport = getViewport();

            setViewport(nextViewport);
            setPosition(current =>
                getClampedPosition({
                    x: current.x,
                    y: current.y,
                    opened,
                    viewport: nextViewport,
                }),
            );
        };

        updateViewport();
        window.addEventListener('resize', updateViewport);

        return () => window.removeEventListener('resize', updateViewport);
    }, [opened]);

    return {
        dragging,
        mounted,
        opened,
        openPanel,
        position,
        size,
        toggleOpen,
        onDragStart,
    };
};
