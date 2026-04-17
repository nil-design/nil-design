import { useEffectCallback, useIsomorphicLayoutEffect } from '@nild/hooks';
import {
    Dispatch,
    FocusEvent,
    KeyboardEvent,
    MutableRefObject,
    RefObject,
    SetStateAction,
    useRef,
    useState,
} from 'react';

interface UseSelectNavigationOptions {
    open: boolean;
    selectedIndex: number;
    enabledIndices: number[];
    triggerRef: RefObject<HTMLButtonElement>;
    listboxRef: RefObject<HTMLDivElement>;
    optionRefs: MutableRefObject<(HTMLDivElement | null)[]>;
    onOpen: () => void;
    onClose: () => void;
    onSelect: (index: number) => void;
}

interface UseSelectNavigationReturn {
    activeIndex: number;
    setActiveIndex: Dispatch<SetStateAction<number>>;
    focusListbox: () => void;
    handleTriggerKeyDown: (evt: KeyboardEvent<HTMLButtonElement>) => void;
    handleListboxKeyDown: (evt: KeyboardEvent<HTMLDivElement>) => void;
    handleListboxBlur: (evt: FocusEvent<HTMLDivElement>) => void;
    focusTrigger: () => void;
}

const requestFocus = ($node: HTMLElement | null | undefined) => {
    if (typeof window === 'undefined' || !$node) {
        return;
    }

    const $document = $node.ownerDocument;

    if ($document.activeElement === $node) {
        return;
    }

    window.requestAnimationFrame(() => {
        if ($node.isConnected && $document.activeElement !== $node) {
            $node.focus();
        }
    });
};

export const useSelectNavigation = ({
    open,
    selectedIndex,
    enabledIndices,
    triggerRef,
    listboxRef,
    optionRefs,
    onOpen,
    onClose,
    onSelect,
}: UseSelectNavigationOptions): UseSelectNavigationReturn => {
    const wasOpenRef = useRef(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const focusListbox = useEffectCallback(() => requestFocus(listboxRef.current));

    const focusTrigger = useEffectCallback(() => requestFocus(triggerRef.current));

    const moveActiveOption = (move: 1 | -1 | 'start' | 'end') =>
        setActiveIndex(currentIndex => {
            const lastPosition = enabledIndices.length - 1;

            if (lastPosition < 0) {
                return -1;
            }

            if (move === 'start') {
                return enabledIndices[0];
            }

            if (move === 'end') {
                return enabledIndices[lastPosition];
            }

            const currentPosition = enabledIndices.indexOf(currentIndex);

            if (currentPosition === -1) {
                return move === 1 ? enabledIndices[0] : enabledIndices[lastPosition];
            }

            const nextPosition = Math.min(Math.max(currentPosition + move, 0), lastPosition);

            return enabledIndices[nextPosition];
        });

    const handleTriggerKeyDown = useEffectCallback((evt: KeyboardEvent<HTMLButtonElement>) => {
        if (enabledIndices.length === 0) {
            return;
        }

        switch (evt.key) {
            case 'ArrowDown':
                evt.preventDefault();
                open ? moveActiveOption(1) : onOpen();
                break;
            case 'ArrowUp':
                evt.preventDefault();
                open ? moveActiveOption(-1) : onOpen();
                break;
            case 'Home':
                if (open) {
                    evt.preventDefault();
                    moveActiveOption('start');
                }
                break;
            case 'End':
                if (open) {
                    evt.preventDefault();
                    moveActiveOption('end');
                }
                break;
            case 'Enter':
            case ' ':
                evt.preventDefault();
                open ? onSelect(activeIndex) : onOpen();
                break;
            case 'Escape':
                if (open) {
                    evt.preventDefault();
                    onClose();
                    focusTrigger();
                }
                break;
            default:
                break;
        }
    });

    const handleListboxKeyDown = useEffectCallback((evt: KeyboardEvent<HTMLDivElement>) => {
        switch (evt.key) {
            case 'ArrowDown':
                evt.preventDefault();
                moveActiveOption(1);
                break;
            case 'ArrowUp':
                evt.preventDefault();
                moveActiveOption(-1);
                break;
            case 'Home':
                evt.preventDefault();
                moveActiveOption('start');
                break;
            case 'End':
                evt.preventDefault();
                moveActiveOption('end');
                break;
            case 'Enter':
            case ' ':
                evt.preventDefault();
                onSelect(activeIndex);
                break;
            case 'Escape':
                evt.preventDefault();
                onClose();
                focusTrigger();
                break;
            case 'Tab':
                onClose();
                break;
            default:
                break;
        }
    });

    const handleListboxBlur = useEffectCallback((evt: FocusEvent<HTMLDivElement>) => {
        const nextTarget = evt.relatedTarget as Node | null;

        if (triggerRef.current?.contains(nextTarget) || listboxRef.current?.contains(nextTarget)) {
            return;
        }

        onClose();
    });

    useIsomorphicLayoutEffect(() => {
        if (!open) {
            wasOpenRef.current = false;
            setActiveIndex(-1);

            return;
        }

        const initialActiveIndex = selectedIndex >= 0 ? selectedIndex : (enabledIndices[0] ?? -1);

        setActiveIndex(currentIndex =>
            wasOpenRef.current && enabledIndices.includes(currentIndex) ? currentIndex : initialActiveIndex,
        );
        wasOpenRef.current = true;
    }, [enabledIndices, open, selectedIndex]);

    useIsomorphicLayoutEffect(() => {
        open && focusListbox();
    }, [focusListbox, open]);

    useIsomorphicLayoutEffect(() => {
        if (!open || activeIndex < 0 || typeof window === 'undefined') {
            return;
        }

        const frame = window.requestAnimationFrame(() => {
            optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [activeIndex, open]);

    return {
        activeIndex,
        setActiveIndex,
        focusTrigger,
        focusListbox,
        handleTriggerKeyDown,
        handleListboxKeyDown,
        handleListboxBlur,
    };
};
