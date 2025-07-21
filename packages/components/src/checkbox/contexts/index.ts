import { createContextSuite } from '@nild/shared';
import { CheckboxProps, GroupProps } from '../interfaces';

const [CheckboxProvider, useCheckboxContext] = createContextSuite<
    Pick<CheckboxProps, 'variant' | 'size' | 'checked'> & { setChecked?: () => void }
>({
    defaultValue: {},
});

const [GroupProvider, useGroupContext] = createContextSuite<
    | (Pick<GroupProps, 'variant' | 'size' | 'disabled'> & {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: any[];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue: (value: any[]) => void;
      })
    | undefined
>({ defaultValue: undefined });

export { CheckboxProvider, GroupProvider, useCheckboxContext, useGroupContext };
