import { useEffectCallback } from '@nild/hooks';
import { KeyboardEvent } from 'react';

type RovingIndexOrientation = 'horizontal' | 'vertical';
type RovingIndexMovement = 1 | -1 | 'start' | 'end';

export interface RovingIndexNavigationOptions<TElement extends HTMLElement = HTMLElement> {
    orientation: RovingIndexOrientation;
    activeIndex: number;
    selectedIndex: number;
    enabledIndices: number[];
    selectOnMove?: boolean;
    selectOnConfirm?: boolean;
    onActiveChange: (index: number) => void;
    onSelect: (index: number) => void;
    onKeyDown?: (evt: KeyboardEvent<TElement>) => void;
}

const getNextRovingIndex = (currentIndex: number, enabledIndices: number[], movement: RovingIndexMovement) => {
    const lastPosition = enabledIndices.length - 1;

    if (lastPosition < 0) {
        return -1;
    }

    if (movement === 'start') {
        return enabledIndices[0];
    }

    if (movement === 'end') {
        return enabledIndices[lastPosition];
    }

    const currentPosition = enabledIndices.indexOf(currentIndex);

    if (currentPosition === -1) {
        return movement === 1 ? enabledIndices[0] : enabledIndices[lastPosition];
    }

    const nextPosition = (currentPosition + movement + enabledIndices.length) % enabledIndices.length;

    return enabledIndices[nextPosition];
};

export const useRovingIndexNavigation = <TElement extends HTMLElement = HTMLElement>({
    orientation,
    activeIndex,
    selectedIndex,
    enabledIndices,
    selectOnMove = false,
    selectOnConfirm = true,
    onActiveChange,
    onSelect,
    onKeyDown,
}: RovingIndexNavigationOptions<TElement>) => {
    const moveActiveIndex = useEffectCallback((movement: RovingIndexMovement) => {
        const baseIndex = enabledIndices.includes(activeIndex) ? activeIndex : selectedIndex;
        const nextIndex = getNextRovingIndex(baseIndex, enabledIndices, movement);

        if (nextIndex < 0) {
            return;
        }

        onActiveChange(nextIndex);

        if (selectOnMove) {
            onSelect(nextIndex);
        }
    });

    const handleKeyDown: (evt: KeyboardEvent<TElement>) => void = useEffectCallback((evt: KeyboardEvent<TElement>) => {
        onKeyDown?.(evt);

        if (evt.defaultPrevented || enabledIndices.length === 0) {
            return;
        }

        const horizontal = orientation === 'horizontal';
        const vertical = orientation === 'vertical';

        switch (evt.key) {
            case 'ArrowRight':
                if (!horizontal) break;
                evt.preventDefault();
                moveActiveIndex(1);
                break;
            case 'ArrowLeft':
                if (!horizontal) break;
                evt.preventDefault();
                moveActiveIndex(-1);
                break;
            case 'ArrowDown':
                if (!vertical) break;
                evt.preventDefault();
                moveActiveIndex(1);
                break;
            case 'ArrowUp':
                if (!vertical) break;
                evt.preventDefault();
                moveActiveIndex(-1);
                break;
            case 'Home':
                evt.preventDefault();
                moveActiveIndex('start');
                break;
            case 'End':
                evt.preventDefault();
                moveActiveIndex('end');
                break;
            case 'Enter':
            case ' ':
                if (!selectOnConfirm) break;
                evt.preventDefault();
                enabledIndices.includes(activeIndex) && onSelect(activeIndex);
                break;
            default:
                break;
        }
    });

    return { handleKeyDown };
};
