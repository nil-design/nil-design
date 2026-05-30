import { useCallback, useEffect, useRef, useState } from 'react';

export const useDraggable = ({ position, setPosition, clamp, onClick }) => {
    const [dragging, setDragging] = useState(false);
    const dragRef = useRef({
        active: false,
        dragging: false,
        offsetX: 0,
        offsetY: 0,
        startX: 0,
        startY: 0,
        clickFallback: true,
        nextPosition: null,
        frameId: 0,
    });

    useEffect(() => {
        const flushMove = () => {
            dragRef.current.frameId = 0;

            if (!dragRef.current.nextPosition) {
                return;
            }

            setPosition(dragRef.current.nextPosition);
            dragRef.current.nextPosition = null;
        };

        const stopDrag = () => {
            if (!dragRef.current.active) {
                return;
            }

            if (dragRef.current.frameId) {
                cancelAnimationFrame(dragRef.current.frameId);
                flushMove();
            }

            if (!dragRef.current.dragging && dragRef.current.clickFallback) {
                onClick?.();
            }

            dragRef.current.active = false;
            dragRef.current.dragging = false;
            dragRef.current.nextPosition = null;
            setDragging(false);
        };

        const handleMove = event => {
            if (!dragRef.current.active) {
                return;
            }

            const nextX = event.clientX - dragRef.current.offsetX;
            const nextY = event.clientY - dragRef.current.offsetY;

            if (!dragRef.current.dragging) {
                if (Math.hypot(event.clientX - dragRef.current.startX, event.clientY - dragRef.current.startY) <= 3) {
                    return;
                }

                dragRef.current.dragging = true;
                setDragging(true);
            }

            dragRef.current.nextPosition = clamp(nextX, nextY);

            if (!dragRef.current.frameId) {
                dragRef.current.frameId = requestAnimationFrame(flushMove);
            }
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', stopDrag);

        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', stopDrag);
        };
    }, [clamp, onClick, setPosition]);

    const onDragStart = useCallback(
        event => {
            if (event.button !== 0) {
                return;
            }

            event.preventDefault();
            dragRef.current = {
                active: true,
                dragging: false,
                offsetX: event.clientX - position.x,
                offsetY: event.clientY - position.y,
                startX: event.clientX,
                startY: event.clientY,
                clickFallback: event.currentTarget?.dataset?.clickFallback !== 'false',
                nextPosition: null,
                frameId: 0,
            };
        },
        [position.x, position.y],
    );

    return { dragging, onDragStart };
};
