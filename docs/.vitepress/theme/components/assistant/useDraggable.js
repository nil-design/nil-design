import { ref, onUnmounted } from 'vue';

export function useDraggable({ position, clamp, onClick }) {
    const dragging = ref(false);
    let dragOffset = { x: 0, y: 0 };

    const stopDrag = () => {
        dragging.value = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = e => {
        const nextX = e.clientX - dragOffset.x;
        const nextY = e.clientY - dragOffset.y;

        if (!dragging.value) {
            if (Math.hypot(nextX - position.value.x, nextY - position.value.y) > 3) {
                dragging.value = true;
            } else {
                return;
            }
        }
        position.value = clamp(nextX, nextY);
    };

    const handleMouseUp = () => {
        if (!dragging.value) onClick?.();
        stopDrag();
    };

    const onDragStart = e => {
        if (e.button !== 0) return;
        e.preventDefault();
        dragOffset.x = e.clientX - position.value.x;
        dragOffset.y = e.clientY - position.value.y;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    onUnmounted(stopDrag);

    return { dragging, onDragStart };
}
