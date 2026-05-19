import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Watermark from '..';
import { Watermark as RootWatermark } from '../../index';
import { RenderParams, createTile, drawToDataUrl, normalizeContent } from '../_shared/canvas';

interface CanvasCall {
    method: string;
    args: unknown[];
}

class TestImage {
    static instances: TestImage[] = [];
    static failNext = false;

    crossOrigin: string | null = null;
    complete = false;
    naturalWidth = 120;
    naturalHeight = 60;
    width = 120;
    height = 60;
    onload: (() => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    private source = '';

    constructor() {
        TestImage.instances.push(this);
    }

    get src() {
        return this.source;
    }

    set src(value: string) {
        this.source = value;

        if (TestImage.failNext) {
            TestImage.failNext = false;
            this.onerror?.(new Event('error'));

            return;
        }

        this.complete = true;
        this.onload?.();
    }
}

const canvasCalls: CanvasCall[] = [];
let toDataUrlResults: Array<string | Error> = [];

interface CreateParamsOptions extends Partial<Omit<RenderParams, 'pattern' | 'textStyle'>> {
    pattern?: Partial<RenderParams['pattern']>;
    textStyle?: Partial<RenderParams['textStyle']>;
}

const createParams = ({ pattern, textStyle, ...params }: CreateParamsOptions = {}): RenderParams => ({
    content: ['Draft'],
    pattern: {
        gap: [64, 48],
        offset: [0, 0],
        rotate: -22,
        composition: 'stack',
        compositionGap: 8,
        ...pattern,
    },
    textStyle: {
        fontSize: 16,
        fontWeight: 400,
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        lineHeight: 22.4,
        color: 'currentColor',
        textAlign: 'center',
        ...textStyle,
    },
    ...params,
});

const createContext = () => {
    let font = '';
    let fillStyle = '';
    let textAlign: CanvasTextAlign = 'center';
    let textBaseline: CanvasTextBaseline = 'middle';

    return {
        scale: vi.fn((...args: unknown[]) => canvasCalls.push({ method: 'scale', args })),
        clearRect: vi.fn((...args: unknown[]) => canvasCalls.push({ method: 'clearRect', args })),
        save: vi.fn((...args: unknown[]) => canvasCalls.push({ method: 'save', args })),
        translate: vi.fn((...args: unknown[]) => canvasCalls.push({ method: 'translate', args })),
        rotate: vi.fn((...args: unknown[]) => canvasCalls.push({ method: 'rotate', args })),
        restore: vi.fn((...args: unknown[]) => canvasCalls.push({ method: 'restore', args })),
        drawImage: vi.fn((...args: unknown[]) => canvasCalls.push({ method: 'drawImage', args })),
        fillText: vi.fn((...args: unknown[]) => canvasCalls.push({ method: 'fillText', args })),
        measureText: vi.fn((text: string) => ({ width: text.length * 8 })),
        get font() {
            return font;
        },
        set font(value: string) {
            font = value;
            canvasCalls.push({ method: 'font', args: [value] });
        },
        get fillStyle() {
            return fillStyle;
        },
        set fillStyle(value: string | CanvasGradient | CanvasPattern) {
            fillStyle = String(value);
            canvasCalls.push({ method: 'fillStyle', args: [value] });
        },
        get textAlign() {
            return textAlign;
        },
        set textAlign(value: CanvasTextAlign) {
            textAlign = value;
            canvasCalls.push({ method: 'textAlign', args: [value] });
        },
        get textBaseline() {
            return textBaseline;
        },
        set textBaseline(value: CanvasTextBaseline) {
            textBaseline = value;
            canvasCalls.push({ method: 'textBaseline', args: [value] });
        },
    } as unknown as CanvasRenderingContext2D;
};

const getLayer = (container: HTMLElement) => container.querySelector('.nd-watermark-layer') as HTMLDivElement;

const waitForPreserve = () =>
    new Promise(resolve => {
        requestAnimationFrame(resolve);
    });

describe('Watermark', () => {
    const brandColor = 'var(--nd-color-brand-60)';
    const resolvedBrandColor = 'computed-brand-color';

    beforeEach(() => {
        canvasCalls.length = 0;
        toDataUrlResults = ['data:image/png;base64,watermark'];
        TestImage.instances = [];
        TestImage.failNext = false;
        vi.clearAllMocks();
        vi.stubGlobal('Image', TestImage);
        vi.spyOn(window.HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => createContext());
        vi.spyOn(window.HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(() => {
            const result = toDataUrlResults.shift() ?? 'data:image/png;base64,watermark';

            if (result instanceof Error) {
                throw result;
            }

            return result;
        });

        const getComputedStyle = window.getComputedStyle.bind(window);

        vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
            const style = getComputedStyle(element, pseudoElement);
            const elementColor = element instanceof HTMLElement ? element.style.color : '';

            Object.defineProperty(style, 'color', {
                configurable: true,
                value: elementColor === brandColor ? resolvedBrandColor : elementColor || 'currentColor',
            });
            Object.defineProperty(style, 'fontFamily', {
                configurable: true,
                value: 'Inter, sans-serif',
            });

            return style;
        });

        Object.defineProperty(window, 'devicePixelRatio', {
            configurable: true,
            value: 2,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('is exported from the package root', () => {
        expect(RootWatermark).toBe(Watermark);
    });

    it('renders children normally', () => {
        render(
            <Watermark>
                <button type="button">Approve</button>
            </Watermark>,
        );

        expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    });

    it('produces a repeated background layer when text is provided', async () => {
        const { container } = render(<Watermark text="Confidential">Document</Watermark>);
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));

        expect(layer).toHaveAttribute('aria-hidden', 'true');
        expect(layer).toHaveClass('pointer-events-none');
        expect(layer).toHaveClass('bg-repeat');
    });

    it('normalizes string arrays and newline strings into text lines', async () => {
        const content = normalizeContent(['Line 1\nLine 2', 'Line 3']);

        drawToDataUrl(createParams({ content }));

        expect(canvasCalls.filter(call => call.method === 'fillText').map(call => call.args[0])).toEqual([
            'Line 1',
            'Line 2',
            'Line 3',
        ]);
    });

    it('applies pattern and layer props to the watermark layer', async () => {
        const { container } = render(
            <Watermark
                text="Draft"
                opacity={0.24}
                zIndex={5}
                pattern={{
                    gap: [12, 20],
                    offset: [8, 16],
                    rotate: 0,
                }}
            >
                Document
            </Watermark>,
        );
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundSize).toBe('52px 43px'));

        expect(layer.style.backgroundImage).toContain('data:image/png');
        expect(layer.style.backgroundPosition).toBe('8px 16px');
        expect(layer.style.opacity).toBe('0.24');
        expect(layer.style.zIndex).toBe('5');
        expect(canvasCalls.find(call => call.method === 'scale')?.args).toEqual([2, 2]);
    });

    it('caps canvas device pixel ratio at 2', () => {
        Object.defineProperty(window, 'devicePixelRatio', {
            configurable: true,
            value: 3,
        });

        const result = drawToDataUrl(createParams());

        expect(canvasCalls.find(call => call.method === 'scale')?.args).toEqual([2, 2]);
        expect(result.width).toBe(110);
        expect(result.height).toBe(84);
    });

    it('uses measured text and rotated bounds for tile size', () => {
        const result = drawToDataUrl(
            createParams({
                content: ['Draft'],
                pattern: { gap: [10, 20], rotate: 90 },
                textStyle: { lineHeight: 20 },
            }),
        );

        expect(result.width).toBe(31);
        expect(result.height).toBe(60);
    });

    it('resolves css variable text color before drawing canvas text', async () => {
        const { container } = render(
            <Watermark text="Brand" textStyle={{ color: brandColor }}>
                Document
            </Watermark>,
        );
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));

        expect(canvasCalls.find(call => call.method === 'fillStyle')?.args[0]).toBe(resolvedBrandColor);
    });

    it('uses distinct composition coordinates for image and text patterns', () => {
        const $image = {
            naturalWidth: 120,
            naturalHeight: 60,
            width: 120,
            height: 60,
        } as HTMLImageElement;
        const coordinates: string[] = [];

        (['stack', 'inline', 'overlay'] as const).forEach(composition => {
            canvasCalls.length = 0;

            drawToDataUrl(
                createParams({
                    image: { src: '/logo.png', width: 40, height: 20 },
                    pattern: { composition },
                }),
                $image,
            );

            const imageArgs = canvasCalls.find(call => call.method === 'drawImage')?.args.slice(1);
            const textArgs = canvasCalls.find(call => call.method === 'fillText')?.args.slice(1);

            expect(imageArgs).toHaveLength(4);
            expect(textArgs).toHaveLength(3);
            coordinates.push(`${imageArgs?.join(',')}|${textArgs?.join(',')}`);
        });

        expect(new Set(coordinates).size).toBe(3);
    });

    it('loads image watermarks with size and crossOrigin options', async () => {
        await createTile(
            createParams({
                content: [],
                image: { src: '/logo.png', width: 48, height: 24, crossOrigin: 'anonymous' },
            }),
        );

        expect(TestImage.instances[0].src).toBe('/logo.png');
        expect(TestImage.instances[0].crossOrigin).toBe('anonymous');
        expect(canvasCalls.find(call => call.method === 'drawImage')?.args.slice(1)).toEqual([-24, -12, 48, 24]);
    });

    it('preserves image ratio when only one image size is provided', async () => {
        await createTile(
            createParams({
                content: [],
                image: { src: '/logo.png', width: 60 },
                pattern: { rotate: 0 },
            }),
        );

        expect(canvasCalls.find(call => call.method === 'drawImage')?.args.slice(1)).toEqual([-30, -15, 60, 30]);
    });

    it('uses image scale and lineHeight for images without explicit size', async () => {
        await createTile(
            createParams({
                content: [],
                image: { src: '/logo.png', scale: 2 },
                pattern: { rotate: 0 },
                textStyle: { lineHeight: 20 },
            }),
        );

        expect(canvasCalls.find(call => call.method === 'drawImage')?.args.slice(1)).toEqual([-40, -20, 80, 40]);
    });

    it('calls onError and falls back to text-only rendering when image loading fails', async () => {
        TestImage.failNext = true;
        toDataUrlResults = ['data:image/png;base64,text-only'];

        const result = await createTile(
            createParams({
                content: ['Fallback'],
                image: { src: '/missing.png', crossOrigin: 'anonymous' },
            }),
        );

        expect(result.error).toBeInstanceOf(Event);
        expect(result.image).toEqual({ src: '/missing.png', crossOrigin: 'anonymous' });
        expect(result.dataUrl).toBe('data:image/png;base64,text-only');
        expect(canvasCalls.some(call => call.method === 'drawImage')).toBe(false);
        expect(canvasCalls.find(call => call.method === 'fillText')?.args[0]).toBe('Fallback');
    });

    it('falls back to text-only rendering when exporting an image canvas fails', async () => {
        toDataUrlResults = [new Error('tainted'), 'data:image/png;base64,text-only'];

        const result = await createTile(
            createParams({
                content: ['Fallback'],
                image: { src: '/logo.png' },
            }),
        );

        expect(result.error).toBeInstanceOf(Error);
        expect(result.dataUrl).toBe('data:image/png;base64,text-only');
        expect(canvasCalls.filter(call => call.method === 'fillText').at(-1)?.args[0]).toBe('Fallback');
    });

    it('returns onError-compatible image information when exporting an image canvas fails', async () => {
        const image = { src: '/logo.png' };

        toDataUrlResults = [new Error('tainted')];

        const result = await createTile(createParams({ content: [], image }));

        expect(result.error).toBeInstanceOf(Error);
        expect(result.image).toEqual(image);
        expect(result.dataUrl).toBeNull();
    });

    it('calls onError with image information when image loading fails in the component', async () => {
        TestImage.failNext = true;
        const onError = vi.fn();
        const image = { src: '/missing.png', crossOrigin: 'anonymous' as const };
        const { container } = render(
            <Watermark text="Fallback" image={image} onError={onError}>
                Document
            </Watermark>,
        );
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError.mock.calls[0][0]).toBeInstanceOf(Event);
        expect(onError.mock.calls[0][1]).toEqual(image);
    });

    it('does not render a background image when no watermark content is provided', async () => {
        const { container } = render(<Watermark>Document</Watermark>);
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toBe(''));

        expect(window.HTMLCanvasElement.prototype.getContext).not.toHaveBeenCalled();
    });

    it('restores the watermark layer by default when it is removed from the root', async () => {
        const { container } = render(<Watermark text="Draft">Document</Watermark>);
        const $root = container.querySelector('.nd-watermark') as HTMLDivElement;
        const layer = getLayer(container);

        layer.remove();

        await waitFor(() => expect($root.lastElementChild).toBe(layer));
    });

    it('calls onTamper when the watermark layer is removed', async () => {
        const onTamper = vi.fn();
        const { container } = render(
            <Watermark text="Draft" onTamper={onTamper}>
                Document
            </Watermark>,
        );
        const $root = container.querySelector('.nd-watermark') as HTMLDivElement;
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));
        layer.remove();

        await waitFor(() => expect($root.lastElementChild).toBe(layer));
        expect(onTamper).toHaveBeenCalledTimes(1);
        expect(onTamper).toHaveBeenCalledWith({ type: 'removed' });
    });

    it('moves the watermark layer back when it is appended elsewhere', async () => {
        const $external = document.createElement('div');
        const { container } = render(<Watermark text="Draft">Document</Watermark>);
        const $root = container.querySelector('.nd-watermark') as HTMLDivElement;
        const layer = getLayer(container);

        document.body.appendChild($external);
        $external.appendChild(layer);

        await waitFor(() => {
            expect(layer.parentNode).toBe($root);
            expect($root.lastElementChild).toBe(layer);
        });

        $external.remove();
    });

    it('does not restore the watermark layer when preserve is disabled', async () => {
        const { container } = render(
            <Watermark text="Draft" preserve={false}>
                Document
            </Watermark>,
        );
        const $root = container.querySelector('.nd-watermark') as HTMLDivElement;
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));

        layer.remove();

        await new Promise(resolve => {
            setTimeout(resolve, 0);
        });

        expect($root.contains(layer)).toBe(false);
    });

    it('calls onTamper when watermark layer attributes are changed', async () => {
        const onTamper = vi.fn();
        const { container } = render(
            <Watermark text="Draft" onTamper={onTamper}>
                Document
            </Watermark>,
        );
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));
        layer.className = '';

        await waitFor(() => expect(layer).toHaveClass('nd-watermark-layer'));
        expect(onTamper).toHaveBeenCalledTimes(1);
        expect(onTamper).toHaveBeenCalledWith({ type: 'attribute', attributeName: 'class' });
    });

    it('restores changed watermark layer classes by default', async () => {
        const { container } = render(<Watermark text="Draft">Document</Watermark>);
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));
        layer.className = '';

        await waitFor(() => expect(layer).toHaveClass('nd-watermark-layer'));
        expect(layer).toHaveClass('pointer-events-none');
        expect(layer).toHaveClass('bg-repeat');
    });

    it('restores changed watermark layer styles by default', async () => {
        const { container } = render(<Watermark text="Draft">Document</Watermark>);
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));
        const backgroundImage = layer.style.backgroundImage;

        layer.style.backgroundImage = 'none';
        layer.style.opacity = '0';
        layer.style.display = 'none';

        await waitFor(() => {
            expect(layer.style.backgroundImage).toBe(backgroundImage);
            expect(layer.style.opacity).toBe('0.16');
            expect(layer.style.display).toBe('');
        });
    });

    it('restores hidden and aria-hidden attributes by default', async () => {
        const { container } = render(<Watermark text="Draft">Document</Watermark>);
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));

        layer.hidden = true;
        layer.setAttribute('aria-hidden', 'false');

        await waitFor(() => {
            expect(layer.hidden).toBe(false);
            expect(layer).toHaveAttribute('aria-hidden', 'true');
        });
    });

    it('restores layer styles from the latest render', async () => {
        const { container, rerender } = render(
            <Watermark text="Draft" opacity={0.12}>
                Document
            </Watermark>,
        );
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));
        rerender(
            <Watermark text="Draft" opacity={0.32}>
                Document
            </Watermark>,
        );

        await waitFor(() => expect(layer.style.opacity).toBe('0.32'));

        layer.style.opacity = '0';

        await waitFor(() => expect(layer.style.opacity).toBe('0.32'));
    });

    it('does not restore or report changed watermark layer styles when preserve is disabled', async () => {
        const onTamper = vi.fn();
        const { container } = render(
            <Watermark text="Draft" preserve={false} onTamper={onTamper}>
                Document
            </Watermark>,
        );
        const layer = getLayer(container);

        await waitFor(() => expect(layer.style.backgroundImage).toContain('data:image/png'));

        layer.style.opacity = '0';
        await waitForPreserve();

        expect(layer.style.opacity).toBe('0');
        expect(onTamper).not.toHaveBeenCalled();
    });

    it('does not throw when MutationObserver is unavailable', () => {
        vi.stubGlobal('MutationObserver', undefined);
        const { container } = render(<Watermark>Document</Watermark>);

        expect(getLayer(container)).toBeInTheDocument();
    });
});
