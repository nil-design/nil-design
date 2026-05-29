import { DynamicIcon } from '@nild/icons';
import { cnMerge } from '@nild/shared';
import React, { useCallback, useEffect, useState } from 'react';
import i18n from '../../../../../locales/index';
import ChatPanel from './components/ChatPanel';
import ConnectPanel from './components/ConnectPanel';
import Header from './components/Header';
import { AssistantProvider } from './contexts/AssistantContext';
import { useDraggable } from './hooks/useDraggable';
import { useRuntime } from './hooks/useRuntime';

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

const getInitialViewport = () => {
    if (typeof window === 'undefined') {
        return { w: 0, h: 0 };
    }

    return { w: window.innerWidth, h: window.innerHeight };
};

const getInitialPosition = viewport => ({
    x: Math.max(SAFE_PADDING, viewport.w - TRIGGER_SIZE.w - SAFE_PADDING),
    y: Math.max(SAFE_PADDING, viewport.h - TRIGGER_SIZE.h - SAFE_PADDING),
});

const Assistant = ({ locale = 'zh-CN', base = '/', routePath = '', navigate }) => {
    const [mounted, setMounted] = useState(false);
    const [opened, setOpened] = useState(false);
    const [viewport, setViewport] = useState(getInitialViewport);
    const [position, setPosition] = useState(() => getInitialPosition(getInitialViewport()));
    const dialogSize = getDialogSize(viewport);
    const size = opened ? dialogSize : TRIGGER_SIZE;

    const clampPosition = useCallback(
        (x, y, targetOpened = opened, targetViewport = viewport) => {
            const targetSize = targetOpened ? getDialogSize(targetViewport) : TRIGGER_SIZE;
            const maxX = Math.max(SAFE_PADDING, targetViewport.w - targetSize.w - SAFE_PADDING);
            const maxY = Math.max(SAFE_PADDING, targetViewport.h - targetSize.h - SAFE_PADDING);

            return {
                x: clampValue(x, SAFE_PADDING, maxX),
                y: clampValue(y, SAFE_PADDING, maxY),
            };
        },
        [opened, viewport],
    );

    const getAnchorOffset = useCallback(
        (targetOpened, targetDialogSize = dialogSize) => {
            if (!targetOpened) {
                return {
                    x: TRIGGER_SIZE.w / 2,
                    y: TRIGGER_SIZE.h / 2,
                };
            }

            return {
                x: targetDialogSize.w - TRIGGER_SIZE.w / 2,
                y: targetDialogSize.h - TRIGGER_SIZE.h / 2,
            };
        },
        [dialogSize],
    );

    const toggleOpen = useCallback(() => {
        const nextOpened = !opened;
        const currentAnchor = getAnchorOffset(opened, dialogSize);
        const nextAnchor = getAnchorOffset(nextOpened, dialogSize);
        const originX = position.x + currentAnchor.x;
        const originY = position.y + currentAnchor.y;
        const nextX = originX - nextAnchor.x;
        const nextY = originY - nextAnchor.y;

        setPosition(clampPosition(nextX, nextY, nextOpened));
        setOpened(nextOpened);
    }, [clampPosition, dialogSize, getAnchorOffset, opened, position.x, position.y]);

    const { dragging, onDragStart } = useDraggable({
        position,
        setPosition,
        clamp: (x, y) => clampPosition(x, y, opened),
        onClick: toggleOpen,
    });
    const openPanel = useCallback(() => {
        setPosition(current => {
            const currentAnchor = getAnchorOffset(opened, dialogSize);
            const nextAnchor = getAnchorOffset(true, dialogSize);
            const originX = current.x + currentAnchor.x;
            const originY = current.y + currentAnchor.y;

            return clampPosition(originX - nextAnchor.x, originY - nextAnchor.y, true);
        });
        setOpened(true);
    }, [clampPosition, dialogSize, getAnchorOffset, opened]);

    const runtime = useRuntime({
        base,
        locale,
        onOpen: openPanel,
    });

    useEffect(() => {
        setMounted(true);

        const updateViewport = () => {
            const nextViewport = { w: window.innerWidth, h: window.innerHeight };
            const nextSize = opened ? getDialogSize(nextViewport) : TRIGGER_SIZE;
            const maxX = Math.max(SAFE_PADDING, nextViewport.w - nextSize.w - SAFE_PADDING);
            const maxY = Math.max(SAFE_PADDING, nextViewport.h - nextSize.h - SAFE_PADDING);

            setViewport(nextViewport);
            setPosition(current => ({
                x: clampValue(current.x, SAFE_PADDING, maxX),
                y: clampValue(current.y, SAFE_PADDING, maxY),
            }));
        };

        updateViewport();
        window.addEventListener('resize', updateViewport);

        return () => window.removeEventListener('resize', updateViewport);
    }, [opened]);

    if (!mounted) {
        return null;
    }

    return (
        <AssistantProvider locale={locale} navigate={navigate} routePath={routePath} runtime={runtime}>
            <div
                className={cnMerge(
                    'nd-assistant-root vp-raw fixed z-39 overflow-hidden font-nd shadow-2xl will-change-[left,top,width,height,border-radius]',
                    dragging
                        ? 'transition-none'
                        : 'transition-[left,top,width,height,border-radius,background-color] ease-[cubic-bezier(0.2,0.85,0.25,1)]',
                    opened ? 'rounded-xl' : 'rounded-2xl',
                )}
                style={{
                    left: position.x,
                    top: position.y,
                    width: size.w,
                    height: size.h,
                }}
            >
                <div
                    className={cnMerge(
                        'absolute inset-0 flex origin-bottom-right flex-col bg-subtle text-main transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]',
                        opened
                            ? 'pointer-events-auto scale-100 opacity-100 delay-75'
                            : 'pointer-events-none scale-95 opacity-0',
                    )}
                    aria-hidden={!opened}
                    inert={opened ? undefined : ''}
                >
                    <Header onClose={toggleOpen} onDragStart={onDragStart} />
                    {!runtime.connected ? <ConnectPanel /> : <ChatPanel />}
                </div>
                <button
                    className={cnMerge(
                        'absolute inset-0 flex items-center justify-center bg-vp-accent-soft text-brand transition-[opacity,transform,background-color] ease-out cursor-pointer select-none hover:text-brand-hover active:text-brand-active',
                        opened ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100',
                    )}
                    type="button"
                    aria-label={i18n.t('assistant.open', { language: locale })}
                    aria-hidden={opened}
                    tabIndex={opened ? -1 : undefined}
                    onMouseDown={onDragStart}
                >
                    <DynamicIcon name="message" variant="filled" className="text-[22px]" />
                </button>
            </div>
        </AssistantProvider>
    );
};

export default Assistant;
