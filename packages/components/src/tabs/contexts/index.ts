import { createContextSuite } from '@nild/shared';
import { TabsProps } from '../interfaces';

const [TabsProvider, useTabsContext] = createContextSuite<
    Pick<TabsProps, 'variant' | 'size' | 'orientation' | 'onClose'> & {
        selectedTabId?: string;
        selectedValue?: unknown;
    }
>({
    defaultValue: {},
});

export { TabsProvider, useTabsContext };
