import {
    autoUpdate,
    computePosition,
    offset as offsetMiddleware,
    shift as shiftMiddleware,
    flip as flipMiddleware,
    arrow as arrowMiddleware,
} from '@floating-ui/dom';
import { useControllableState, useIsomorphicLayoutEffect, useStableCallback } from '@nild/hooks';
import { getDPR, roundByDPR } from '@nild/shared/utils';
import {
    ReactNode,
    ReactElement,
    Children,
    cloneElement,
    isValidElement,
    useMemo,
    useRef,
    useState,
    Dispatch,
} from 'react';
import Portal, { PortalProps } from '../../portal';
import Transition from '../../transition';
import Trigger, { TriggerProps } from '../../trigger';
import type { Placement, Strategy, OffsetOptions, Coords, Side } from '@floating-ui/dom';

interface UsePopupOptions {
    placement?: Placement;
    strategy?: Strategy;
    offset?: OffsetOptions;
    open?: boolean;
    defaultOpen?: boolean;
}

type UsePopupReturn = [
    boolean,
    {
        setOpen: Dispatch<React.SetStateAction<boolean>>;
        renderTrigger: (props?: TriggerProps) => ReactElement | undefined;
        renderPortal: (props?: PortalProps) => ReactElement | undefined;
    },
];

const usePopup = (
    children: ReactNode,
    {
        placement = 'bottom',
        strategy = 'absolute',
        offset = 12,
        open: externalOpen,
        defaultOpen = false,
    }: UsePopupOptions = {},
): UsePopupReturn => {
    const triggerRef = useRef<Element>(null);
    const portalRef = useRef<HTMLElement>(null);
    const arrowRef = useRef<Element>(null);

    const [mounted, setMounted] = useState(defaultOpen);
    const [open, setOpen] = useControllableState(externalOpen, defaultOpen);
    const [portalCoords, setPortalCoords] = useState<Coords>({ x: 0, y: 0 });
    const [arrowCoords, setArrowCoords] = useState<Coords>({ x: 0, y: 0 });
    const [side, setSide] = useState<Side>(placement.split('-')[0] as Side);
    const arrowRelativePosition = useMemo(() => {
        const horizontal = side === 'top' || side === 'bottom';

        return {
            [side === 'left' ? 'right' : 'left']: horizontal ? arrowCoords.x : arrowCoords.x - portalCoords.x,
            [side === 'top' ? 'bottom' : 'top']: !horizontal ? arrowCoords.y : arrowCoords.y - portalCoords.y,
        };
    }, [side, arrowCoords, portalCoords]);
    const arrowOrientation = {
        top: 'down',
        bottom: 'up',
        left: 'right',
        right: 'left',
    }[side];

    let firstBareChild: ReactElement | undefined;
    let triggerChild: ReactElement | undefined;
    let portalChild: ReactElement | undefined;

    Children.forEach(children, child => {
        if (isValidElement(child) && child.type !== Trigger && child.type !== Portal) {
            firstBareChild = child;
        }
        if (isValidElement(child) && child.type === Trigger) {
            triggerChild = child;
        }
        if (isValidElement(child) && child.type === Portal) {
            portalChild = child;
        }
    });

    const renderTrigger = useStableCallback((props?: TriggerProps) => {
        if (triggerChild) {
            return cloneElement(triggerChild, {
                ...props,
                ref: triggerRef,
            });
        }
        if (firstBareChild) {
            return (
                <Trigger {...props} ref={triggerRef}>
                    {firstBareChild}
                </Trigger>
            );
        }
    });

    const renderPortal = useStableCallback((props?: PortalProps) => {
        if (portalChild) {
            return (
                <Transition visible={open}>
                    {mounted &&
                        cloneElement(portalChild, {
                            ...portalChild.props,
                            ...props,
                            style: {
                                transform: `translate(${portalCoords.x}px, ${portalCoords.y}px)`,
                                ...(getDPR() >= 1.5 && { willChange: 'transform' }),
                            },
                            ref: portalRef,
                            arrow: {
                                ref: arrowRef,
                                style: arrowRelativePosition,
                                orientation: arrowOrientation,
                            },
                        })}
                </Transition>
            );
        }
    });

    const update = useStableCallback(() => {
        if (!triggerRef.current || !portalRef.current) return;

        computePosition(triggerRef.current, portalRef.current, {
            placement,
            strategy,
            middleware: [
                offsetMiddleware(offset),
                shiftMiddleware(),
                flipMiddleware(),
                arrowRef.current && arrowMiddleware({ element: arrowRef.current }),
            ],
        }).then(({ x, y, placement, middlewareData: { arrow } }) => {
            setPortalCoords({ x: roundByDPR(x), y: roundByDPR(y) });
            setSide(placement.split('-')[0] as Side);
            setArrowCoords({ x: roundByDPR(arrow?.x ?? x), y: roundByDPR(arrow?.y ?? y) });
        });
    });

    useIsomorphicLayoutEffect(() => {
        if (open && !mounted) {
            setMounted(true);
        } else if (open && mounted) {
            update();
        }
    }, [open, mounted]);

    useIsomorphicLayoutEffect(() => {
        if (!triggerRef.current || !portalRef.current || !open) return;

        return autoUpdate(triggerRef.current, portalRef.current, update);
    }, [placement, strategy, offset, open]);

    return [
        open,
        {
            setOpen,
            renderTrigger,
            renderPortal,
        },
    ];
};

export default usePopup;
