import { Fragment, ReactElement, ReactNode, createElement } from 'react';
import { describe, expect, it } from 'vitest';
import registerSlots from '..';

const PrimarySlot = ({ children }: { children?: ReactNode }) => createElement('div', null, children);
const SecondarySlot = ({ children }: { children?: ReactNode }) => createElement('span', null, children);

describe('registerSlots', () => {
    it('collects matched single slots', () => {
        const collectSlots = registerSlots({
            primary: {
                isMatched: child => child.type === PrimarySlot,
            },
        });
        const result = collectSlots([
            createElement(PrimarySlot, { key: 'primary' }, 'Primary'),
            createElement('div', { key: 'rest' }, 'Rest'),
        ]);

        expect(((result.slots.primary.el as ReactElement | null)?.props as { children?: string })?.children).toBe(
            'Primary',
        );
        expect(result.slots.primary.seq).toBe(0);
    });

    it('keeps the last duplicate slot by default', () => {
        const collectSlots = registerSlots({
            primary: {
                isMatched: child => child.type === PrimarySlot,
            },
        });
        const result = collectSlots([
            createElement(PrimarySlot, { key: 'first' }, 'First'),
            createElement(PrimarySlot, { key: 'second' }, 'Second'),
        ]);

        expect(((result.slots.primary.el as ReactElement | null)?.props as { children?: string })?.children).toBe(
            'Second',
        );
        expect(result.slots.primary.seq).toBe(1);
    });

    it('keeps the first duplicate slot when configured', () => {
        const collectSlots = registerSlots({
            primary: {
                isMatched: child => child.type === PrimarySlot,
                strategy: 'first',
            },
        });
        const result = collectSlots([
            createElement(PrimarySlot, { key: 'first' }, 'First'),
            createElement(PrimarySlot, { key: 'second' }, 'Second'),
        ]);

        expect(((result.slots.primary.el as ReactElement | null)?.props as { children?: string })?.children).toBe(
            'First',
        );
        expect(result.slots.primary.seq).toBe(0);
    });

    it('collects multiple slot children into an array', () => {
        const collectSlots = registerSlots({
            secondary: {
                isMatched: child => child.type === SecondarySlot,
                multiple: true,
            },
        });
        const result = collectSlots([
            createElement(SecondarySlot, { key: 'one' }, 'One'),
            createElement(SecondarySlot, { key: 'two' }, 'Two'),
        ]);

        expect((result.slots.secondary.el as ReactElement[]).map(child => child.props.children)).toEqual([
            'One',
            'Two',
        ]);
        expect(result.slots.secondary.seq).toEqual([0, 1]);
    });

    it('collects plain text children and ignores empty values', () => {
        const collectSlots = registerSlots({
            primary: {
                isMatched: child => child.type === PrimarySlot,
            },
        });
        const result = collectSlots(
            createElement(Fragment, null, 'Alpha', 7, null, undefined, false, createElement('div', null, 'Rest')),
        );

        expect(result.plainChildren).toEqual([
            {
                content: 'Alpha',
                seq: 0,
            },
            {
                content: 7,
                seq: 1,
            },
        ]);
    });

    it('flattens arrays and fragments before matching', () => {
        const collectSlots = registerSlots({
            primary: {
                isMatched: child => child.type === PrimarySlot,
            },
            secondary: {
                isMatched: child => child.type === SecondarySlot,
            },
        });
        const result = collectSlots(
            createElement(
                Fragment,
                null,
                [createElement(PrimarySlot, { key: 'primary' }, 'Primary')],
                createElement(Fragment, null, createElement(SecondarySlot, { key: 'secondary' }, 'Secondary')),
            ),
        );

        expect(((result.slots.primary.el as ReactElement | null)?.props as { children?: string })?.children).toBe(
            'Primary',
        );
        expect(result.slots.primary.seq).toBe(0);
        expect(((result.slots.secondary.el as ReactElement | null)?.props as { children?: string })?.children).toBe(
            'Secondary',
        );
        expect(result.slots.secondary.seq).toBe(1);
    });

    it('resets collected slots between calls', () => {
        const collectSlots = registerSlots({
            primary: {
                isMatched: child => child.type === PrimarySlot,
            },
            secondary: {
                isMatched: child => child.type === SecondarySlot,
                multiple: true,
            },
        });

        collectSlots([
            createElement(PrimarySlot, { key: 'primary' }, 'Primary'),
            createElement(SecondarySlot, { key: 'secondary-one' }, 'One'),
            createElement(SecondarySlot, { key: 'secondary-two' }, 'Two'),
        ]);

        const result = collectSlots(createElement('div', null, 'Rest'));

        expect(result.slots.primary.el).toBeNull();
        expect(result.slots.primary.seq).toBe(-1);
        expect(result.slots.secondary.el).toEqual([]);
        expect(result.slots.secondary.seq).toEqual([]);
        expect(result.plainChildren).toEqual([]);
    });
});
