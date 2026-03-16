import { Children, Fragment, ReactElement, ReactNode, isValidElement } from 'react';

interface SlotDefinition {
    isMatched: (child: ReactElement) => boolean;
    multiple?: boolean;
    strategy?: 'first' | 'last';
}

type SlotSchema = Record<string, SlotDefinition>;

interface SingleSlot {
    el: ReactElement | null;
    seq: number;
}

interface MultipleSlot {
    el: ReactElement[];
    seq: number[];
}

interface PlainChild {
    content: string | number;
    seq: number;
}

type SlotValue<T extends SlotDefinition> = T['multiple'] extends true ? MultipleSlot : SingleSlot;

interface CollectSlotsResult<Schema extends SlotSchema> {
    slots: {
        [K in keyof Schema]: SlotValue<Schema[K]>;
    };
    plainChildren: PlainChild[];
}

const registerSlots = <Schema extends SlotSchema>(schema: Schema) => {
    const schemaEntries = Object.entries(schema) as Array<[string, SlotDefinition]>;

    return (children: ReactNode): CollectSlotsResult<Schema> => {
        const slots = schemaEntries.reduce<Record<string, SingleSlot | MultipleSlot>>((acc, [slotName, definition]) => {
            acc[slotName] = definition.multiple ? { el: [], seq: [] } : { el: null, seq: -1 };

            return acc;
        }, {});
        const plainChildren: PlainChild[] = [];

        let seq = 0;

        const visitChildren = (children: ReactNode) => {
            Children.forEach(children, child => {
                if (child === null || child === undefined || typeof child === 'boolean') {
                    return;
                }
                if (isValidElement(child) && child.type === Fragment) {
                    visitChildren(child.props.children);

                    return;
                }
                if (typeof child === 'string' || typeof child === 'number') {
                    plainChildren.push({
                        content: child,
                        seq,
                    });
                    seq += 1;

                    return;
                }
                if (!isValidElement(child)) {
                    seq += 1;

                    return;
                }
                for (const [slotName, definition] of schemaEntries) {
                    if (!definition.isMatched(child)) {
                        continue;
                    }
                    if (definition.multiple) {
                        (slots[slotName] as MultipleSlot).el.push(child);
                        (slots[slotName] as MultipleSlot).seq.push(seq);
                    } else if (
                        (slots[slotName] as SingleSlot).el === null ||
                        (definition.strategy ?? 'last') === 'last'
                    ) {
                        (slots[slotName] as SingleSlot).el = child;
                        (slots[slotName] as SingleSlot).seq = seq;
                    }
                    break;
                }
                seq += 1;
            });
        };

        visitChildren(children);

        return {
            slots: slots as CollectSlotsResult<Schema>['slots'],
            plainChildren,
        };
    };
};

export default registerSlots;
