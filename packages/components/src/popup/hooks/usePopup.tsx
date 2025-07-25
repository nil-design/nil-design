import {
    autoUpdate,
    computePosition,
    offset as offsetMiddleware,
    shift as shiftMiddleware,
    flip as flipMiddleware,
    arrow as arrowMiddleware,
} from '@floating-ui/dom';
import { useEffectCallback } from '@nild/hooks';
import { roundByDPR } from '@nild/shared/utils';
import { useState, CSSProperties, useRef, RefObject } from 'react';
import { ArrowOrientation } from '../interfaces';
import type { Placement, Strategy, OffsetOptions, Coords, Side } from '@floating-ui/dom';

interface UsePopupOptions {
    placement?: Placement;
    strategy?: Strategy;
    offset?: OffsetOptions;
}

type UsePopupReturn = [
    {
        triggerRef: RefObject<Element>;
        portalRef: RefObject<HTMLDivElement>;
        portalContext: {
            coords: Coords;
        };
        arrowRef: RefObject<HTMLDivElement>;
        arrowContext: {
            style: CSSProperties;
            orientation: ArrowOrientation;
        };
    },
    {
        update: () => void;
        autoUpdate: typeof autoUpdate;
    },
];

const usePopup = ({
    placement = 'bottom',
    strategy = 'absolute',
    offset = 12,
}: UsePopupOptions = {}): UsePopupReturn => {
    const triggerRef = useRef<Element>(null);
    const portalRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);

    const [portalCoords, setPortalCoords] = useState<Coords>({ x: 0, y: 0 });
    const [arrowCoords, setArrowCoords] = useState<Coords>({ x: 0, y: 0 });
    const [side, setSide] = useState<Side>(placement.split('-')[0] as Side);

    const horizontal = side === 'top' || side === 'bottom';
    const portalContext = {
        coords: portalCoords,
    };
    const arrowContext = {
        style: {
            [side === 'left' ? 'right' : 'left']: horizontal ? arrowCoords.x : arrowCoords.x - portalCoords.x,
            [side === 'top' ? 'bottom' : 'top']: !horizontal ? arrowCoords.y : arrowCoords.y - portalCoords.y,
        },
        orientation: {
            top: 'down',
            bottom: 'up',
            left: 'right',
            right: 'left',
        }[side] as ArrowOrientation,
    };

    const update = useEffectCallback(() => {
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

    return [
        {
            triggerRef,
            portalRef,
            portalContext,
            arrowRef,
            arrowContext,
        },
        {
            update,
            autoUpdate,
        },
    ];
};

export default usePopup;
