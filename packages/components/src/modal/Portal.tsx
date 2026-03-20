import { useEffectCallback, useEventListener, useIsomorphicLayoutEffect } from '@nild/hooks';
import { cnMerge, mergeRefs } from '@nild/shared';
import {
    CSSProperties,
    MouseEvent,
    ReactElement,
    forwardRef,
    useEffect,
    useMemo,
    useState,
    isValidElement,
} from 'react';
import { createPortal } from 'react-dom';
import { mergeProps } from '../_shared/utils';
import { useModalContext } from './contexts';
import { PortalProps } from './interfaces';
import {
    addModalToStack,
    focusWithin,
    getFocusableElements,
    getModalStackIndex,
    isTopModal,
    lockDocumentScroll,
    MODAL_TRANSITION_DURATION,
    removeModalFromStack,
    resolveDocument,
    subscribeModalStack,
} from './internals';
import variants from './style';

export const isPortalElement = (child: unknown): child is ReactElement<PortalProps> => {
    return isValidElement(child) && child.type === Portal;
};

const Portal = forwardRef<HTMLDivElement, PortalProps>(
    (
        {
            className,
            style,
            children,
            container,
            overlaid = true,
            'aria-label': portalAriaLabel,
            'aria-labelledby': portalAriaLabelledBy,
            'aria-describedby': portalAriaDescribedBy,
            ...restProps
        },
        ref,
    ) => {
        const {
            id,
            open,
            placement,
            size,
            closeOnEscape,
            closeOnOverlayClick,
            trapFocus,
            lockScroll,
            accessibility,
            refs,
            requestOpen,
        } = useModalContext();
        const [present, setPresent] = useState(open);
        const [visible, setVisible] = useState(open);
        const [stackVersion, forceStackSync] = useState(0);
        const ownerDocument = resolveDocument(container, refs.surface.current, refs.trigger.current);
        const portalContainer = useMemo(() => {
            if (container) {
                return container;
            }

            return ownerDocument?.body ?? null;
        }, [container, ownerDocument]);
        const viewportStyle = useMemo<CSSProperties>(() => {
            const stackIndex = getModalStackIndex(id);

            return {
                zIndex: 40 + (stackIndex === -1 ? 0 : stackIndex),
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [id, stackVersion]);

        const close = useEffectCallback(() => {
            requestOpen(false);
        });

        const handleOverlayClick = useEffectCallback((evt: MouseEvent<HTMLDivElement>) => {
            if (!overlaid || !closeOnOverlayClick || !isTopModal(id)) {
                return;
            }

            requestOpen(false);

            return evt;
        });

        const handleKeyDown = useEffectCallback((evt: KeyboardEvent) => {
            const surface = refs.surface.current;

            if (!surface || !present || !isTopModal(id)) {
                return;
            }

            if (evt.key === 'Escape' && closeOnEscape) {
                evt.preventDefault();
                close();

                return;
            }

            if (evt.key !== 'Tab' || !trapFocus) {
                return;
            }

            const focusables = getFocusableElements(surface);
            const activeElement = ownerDocument?.activeElement as HTMLElement | null;

            if (focusables.length === 0) {
                evt.preventDefault();
                surface.focus();

                return;
            }

            if (!activeElement || !surface.contains(activeElement)) {
                evt.preventDefault();
                focusWithin(surface, evt.shiftKey);

                return;
            }

            const firstFocusable = focusables[0];
            const lastFocusable = focusables.at(-1);

            if (evt.shiftKey && activeElement === firstFocusable) {
                evt.preventDefault();
                lastFocusable?.focus();
            } else if (!evt.shiftKey && activeElement === lastFocusable) {
                evt.preventDefault();
                firstFocusable?.focus();
            }
        });

        const handleFocusIn = useEffectCallback((evt: FocusEvent) => {
            const surface = refs.surface.current;
            const nextTarget = evt.target as Node | null;

            if (!surface || !trapFocus || !present || !isTopModal(id) || !nextTarget || surface.contains(nextTarget)) {
                return;
            }

            focusWithin(surface);
        });

        useEffect(() => {
            return subscribeModalStack(() => {
                forceStackSync(version => version + 1);
            });
        }, []);

        useEffect(() => {
            const timers: Array<ReturnType<typeof setTimeout>> = [];

            if (open) {
                setPresent(true);
                timers.push(
                    setTimeout(() => {
                        setVisible(true);
                    }, 0),
                );
            } else if (present) {
                setVisible(false);
                timers.push(
                    setTimeout(() => {
                        setPresent(false);
                    }, MODAL_TRANSITION_DURATION),
                );
            }

            return () => {
                timers.forEach(timer => {
                    clearTimeout(timer);
                });
            };
        }, [open, present]);

        useEffect(() => {
            if (!present) {
                return;
            }

            addModalToStack(id);

            return () => {
                removeModalFromStack(id);
            };
        }, [id, present]);

        useEffect(() => {
            if (!present || !lockScroll || !ownerDocument) {
                return;
            }

            return lockDocumentScroll(ownerDocument);
        }, [lockScroll, ownerDocument, present]);

        useIsomorphicLayoutEffect(() => {
            if (!open || !present) {
                return;
            }

            const timer = setTimeout(() => {
                const surface = refs.surface.current;

                if (!surface || !isTopModal(id)) {
                    return;
                }

                const activeElement = ownerDocument?.activeElement as Node | null;

                if (!activeElement || !surface.contains(activeElement)) {
                    focusWithin(surface);
                }
            }, 0);

            return () => {
                clearTimeout(timer);
            };
        }, [id, open, ownerDocument, present, refs.surface]);

        useEventListener(ownerDocument, 'keydown', handleKeyDown);
        useEventListener(ownerDocument, 'focusin', handleFocusIn);

        if (!present || !portalContainer) {
            return null;
        }

        const surfaceProps = mergeProps(restProps, {
            className: cnMerge(variants.surface({ placement, size, visible }), className),
            style,
        });

        return createPortal(
            <div className={variants.viewport({ placement })} style={viewportStyle}>
                {overlaid && <div className={variants.overlay({ visible })} onClick={handleOverlayClick} />}
                <div
                    {...surfaceProps}
                    aria-describedby={portalAriaDescribedBy ?? accessibility['aria-describedby']}
                    aria-label={portalAriaLabel ?? accessibility['aria-label']}
                    aria-labelledby={portalAriaLabelledBy ?? accessibility['aria-labelledby']}
                    aria-modal="true"
                    ref={mergeRefs(refs.surface, ref)}
                    role="dialog"
                    tabIndex={-1}
                >
                    {children}
                </div>
            </div>,
            portalContainer,
        );
    },
);

Portal.displayName = 'Modal.Portal';

export default Portal;
