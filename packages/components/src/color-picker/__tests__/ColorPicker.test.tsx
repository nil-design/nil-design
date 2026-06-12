import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ColorPicker from '..';
import Field from '../../field';
import Form from '../../form';
import { ColorPicker as RootColorPicker } from '../../index';
import { BLACK_COLOR, getReadableTextColor, parseColorValue, WHITE_COLOR } from '../_shared/color';

vi.mock('@floating-ui/dom', () => ({
    autoUpdate: vi.fn(() => vi.fn()),
    computePosition: vi.fn(() =>
        Promise.resolve({
            x: 0,
            y: 0,
            placement: 'bottom',
            middlewareData: {
                arrow: { x: 0, y: 0 },
            },
        }),
    ),
    offset: vi.fn(() => ({ name: 'offset' })),
    shift: vi.fn(() => ({ name: 'shift' })),
    flip: vi.fn(() => ({ name: 'flip' })),
    arrow: vi.fn(() => ({ name: 'arrow' })),
}));

const openPicker = async (name = 'Select color') => {
    fireEvent.click(screen.getByRole('button', { name }));

    return waitFor(() => screen.getByRole('dialog', { name: 'Color picker' }));
};

const DEFAULT_COLOR = '#1677ff';
const BLACK = '#000000';
const RED = '#ff0000';
const RED_ALPHA = '#ff000080';
const RED_ALPHA_RGB = 'rgba(255, 0, 0, 0.5)';
const RED_ALPHA_HSL = 'hsla(0, 100%, 50%, 0.5)';
const RED_TRANSPARENT = '#ff000000';
const SHORT_HEX = '#123';
const SHORT_HEX_FORMATTED = '#112233';

describe('ColorPicker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
            callback(0);

            return 0;
        });
    });

    it('is exported from the package root and opens with the default trigger', async () => {
        render(<ColorPicker defaultValue={RED_ALPHA} />);

        expect(RootColorPicker).toBe(ColorPicker);

        await openPicker();

        expect(screen.getByRole('textbox', { name: 'Color value' })).toHaveValue(RED_ALPHA);
    });

    it('opens from a custom trigger slot', async () => {
        render(
            <ColorPicker defaultValue={DEFAULT_COLOR}>
                <ColorPicker.Trigger>
                    <button type="button">Brand color</button>
                </ColorPicker.Trigger>
            </ColorPicker>,
        );

        await openPicker('Brand color');

        expect(screen.getByRole('dialog', { name: 'Color picker' })).toBeInTheDocument();
    });

    it('routes portal class name to the popup portal layer', async () => {
        render(<ColorPicker defaultValue={DEFAULT_COLOR} portalClassName="portal-marker" />);

        const dialog = await openPicker();

        expect(dialog).toBeInTheDocument();
        expect(document.querySelector('.portal-marker')).toContainElement(dialog);
    });

    it('supports uncontrolled preset selection and reports formatted metadata', async () => {
        const onChange = vi.fn();

        render(<ColorPicker defaultValue={BLACK} presets={[RED]} onChange={onChange} />);
        await openPicker();

        fireEvent.click(screen.getByRole('button', { name: RED }));

        expect(screen.getByRole('textbox', { name: 'Color value' })).toHaveValue(RED);
        expect(onChange).toHaveBeenCalledWith(
            RED,
            expect.objectContaining({
                alpha: 1,
                format: 'hex',
                hex: RED,
                valid: true,
            }),
        );
    });

    it('keeps controlled value and format in sync with callbacks', async () => {
        const onChange = vi.fn();
        const onFormatChange = vi.fn();

        const Demo = () => {
            const [value, setValue] = useState(RED_ALPHA);
            const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');

            return (
                <ColorPicker
                    format={format}
                    value={value}
                    onChange={(nextValue, meta) => {
                        onChange(nextValue, meta);
                        setValue(nextValue);
                    }}
                    onFormatChange={nextFormat => {
                        onFormatChange(nextFormat);
                        setFormat(nextFormat);
                    }}
                />
            );
        };

        render(<Demo />);
        await openPicker();

        fireEvent.click(screen.getByRole('radio', { name: 'RGB' }));

        expect(onFormatChange).toHaveBeenCalledWith('rgb');
        expect(onChange).toHaveBeenLastCalledWith(
            RED_ALPHA_RGB,
            expect.objectContaining({
                alpha: 0.5,
                b: 0,
                format: 'rgb',
                g: 0,
                r: 255,
            }),
        );
        expect(onChange.mock.lastCall?.[1]).not.toHaveProperty('hex');
        expect(screen.getByRole('textbox', { name: 'Color value' })).toHaveValue(RED_ALPHA_RGB);

        fireEvent.click(screen.getByRole('radio', { name: 'HSL' }));

        expect(onFormatChange).toHaveBeenCalledWith('hsl');
        expect(onChange).toHaveBeenLastCalledWith(
            RED_ALPHA_HSL,
            expect.objectContaining({
                alpha: 0.5,
                format: 'hsl',
                h: 0,
                l: 50,
                s: 100,
            }),
        );
        expect(onChange.mock.lastCall?.[1]).not.toHaveProperty('rgb');
        expect(screen.getByRole('textbox', { name: 'Color value' })).toHaveValue(RED_ALPHA_HSL);
    });

    it('preserves valid input text while editing and formats it on blur', async () => {
        const onChange = vi.fn();

        render(<ColorPicker defaultValue={BLACK} onChange={onChange} />);
        await openPicker();

        const input = screen.getByRole('textbox', { name: 'Color value' });

        fireEvent.change(input, { target: { value: SHORT_HEX } });

        expect(input).toHaveValue(SHORT_HEX);
        expect(input).not.toHaveAttribute('aria-invalid');
        expect(onChange).toHaveBeenLastCalledWith(
            SHORT_HEX_FORMATTED,
            expect.objectContaining({ format: 'hex', hex: SHORT_HEX_FORMATTED }),
        );

        fireEvent.blur(input);

        expect(input).toHaveValue(SHORT_HEX_FORMATTED);
    });

    it('does not commit invalid input and restores the last formatted value on blur', async () => {
        const onChange = vi.fn();

        render(<ColorPicker defaultValue={DEFAULT_COLOR} onChange={onChange} />);
        await openPicker();

        const input = screen.getByRole('textbox', { name: 'Color value' });

        fireEvent.change(input, { target: { value: 'not-a-color' } });

        expect(input).toHaveValue('not-a-color');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(onChange).not.toHaveBeenCalled();

        fireEvent.blur(input);

        expect(input).toHaveValue(DEFAULT_COLOR);
        expect(input).not.toHaveAttribute('aria-invalid');
    });

    it('updates alpha through the alpha slider', async () => {
        const onChange = vi.fn();

        render(<ColorPicker defaultValue={RED} onChange={onChange} />);
        await openPicker();

        fireEvent.keyDown(screen.getByRole('slider', { name: 'Alpha' }), { key: 'Home' });

        expect(screen.getByRole('textbox', { name: 'Color value' })).toHaveValue(RED_TRANSPARENT);
        expect(onChange).toHaveBeenLastCalledWith(
            RED_TRANSPARENT,
            expect.objectContaining({ alpha: 0, format: 'hex' }),
        );
    });

    it('keeps the hue slider at the right edge when hue reaches 360', async () => {
        render(<ColorPicker defaultValue={RED} />);
        await openPicker();

        const hueSlider = screen.getByRole('slider', { name: 'Hue' });

        fireEvent.keyDown(hueSlider, { key: 'End' });

        await waitFor(() => expect(hueSlider).toHaveAttribute('aria-valuenow', '360'));
    });

    it('chooses preset check colors for saturated and bright presets', () => {
        expect(getReadableTextColor(parseColorValue('#13c2c2')!)).toBe(WHITE_COLOR);
        expect(getReadableTextColor(parseColorValue('#faad14')!)).toBe(BLACK_COLOR);
    });

    it('closes with Escape and restores focus to the trigger', async () => {
        render(<ColorPicker defaultValue={DEFAULT_COLOR} />);

        const trigger = screen.getByRole('button', { name: 'Select color' });
        const dialog = await openPicker();

        fireEvent.keyDown(dialog, { key: 'Escape' });

        expect(trigger).toHaveFocus();
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not open or change when disabled', () => {
        const onChange = vi.fn();

        render(<ColorPicker disabled onChange={onChange} />);

        const trigger = screen.getByRole('button', { name: 'Select color' });

        fireEvent.click(trigger);
        fireEvent.keyDown(trigger, { key: 'Enter' });

        expect(trigger).toBeDisabled();
        expect(screen.queryByRole('dialog', { name: 'Color picker' })).not.toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('feeds Field form binding through the first onChange argument', async () => {
        const onChange = vi.fn();

        render(
            <Form defaultValue={{ color: BLACK }} onChange={onChange}>
                <Field name="color">
                    <ColorPicker aria-label="Theme color" presets={[RED]} />
                </Field>
            </Form>,
        );

        await openPicker('Theme color');
        fireEvent.click(screen.getByRole('button', { name: RED }));

        expect(onChange).toHaveBeenCalledWith({ color: RED });
    });
});
