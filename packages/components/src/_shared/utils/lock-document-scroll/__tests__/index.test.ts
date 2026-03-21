import { afterEach, describe, expect, it, vi } from 'vitest';
import lockDocumentScroll from '..';

describe('lockDocumentScroll', () => {
    const cleanups: VoidFunction[] = [];
    const originalInnerWidth = window.innerWidth;
    const originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'clientWidth');

    afterEach(() => {
        while (cleanups.length > 0) {
            cleanups.pop()?.();
        }

        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        if (originalClientWidthDescriptor) {
            Object.defineProperty(document.documentElement, 'clientWidth', originalClientWidthDescriptor);
        }

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: originalInnerWidth,
        });

        vi.restoreAllMocks();
    });

    it('locks body scroll and compensates body padding for the scrollbar width', () => {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '8px';

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 1000,
        });
        Object.defineProperty(document.documentElement, 'clientWidth', {
            configurable: true,
            get: () => 980,
        });

        cleanups.push(lockDocumentScroll(document));

        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.style.paddingRight).toBe('28px');
    });

    it('keeps the document locked until the last cleanup runs', () => {
        const firstUnlock = lockDocumentScroll(document);
        const secondUnlock = lockDocumentScroll(document);

        cleanups.push(firstUnlock, secondUnlock);

        expect(document.body.style.overflow).toBe('hidden');

        secondUnlock();

        expect(document.body.style.overflow).toBe('hidden');

        firstUnlock();

        expect(document.body.style.overflow).toBe('');

        cleanups.length = 0;
    });

    it('skips padding compensation when the document already reserves scrollbar gutter', () => {
        const originalGetComputedStyle = window.getComputedStyle.bind(window);

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 1000,
        });
        Object.defineProperty(document.documentElement, 'clientWidth', {
            configurable: true,
            get: () => 980,
        });

        vi.spyOn(window, 'getComputedStyle').mockImplementation(element => {
            const style = originalGetComputedStyle(element);

            if (element === document.documentElement) {
                return new Proxy(style, {
                    get(target, property, receiver) {
                        if (property === 'scrollbarGutter') {
                            return 'stable';
                        }

                        if (property === 'getPropertyValue') {
                            return (name: string) => {
                                if (name === 'scrollbar-gutter') {
                                    return 'stable';
                                }

                                return target.getPropertyValue(name);
                            };
                        }

                        return Reflect.get(target, property, receiver);
                    },
                }) as CSSStyleDeclaration;
            }

            return style;
        });

        cleanups.push(lockDocumentScroll(document));

        expect(document.body.style.overflow).toBe('hidden');
        expect(document.body.style.paddingRight).toBe('');
    });
});
