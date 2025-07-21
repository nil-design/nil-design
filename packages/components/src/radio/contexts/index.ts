import { createContextSuite } from '@nild/shared';
import { RadioProps, GroupProps } from '../interfaces';

const [RadioProvider, useRadioContext] = createContextSuite<
    Pick<RadioProps, 'variant' | 'size' | 'checked'> & { setChecked?: () => void }
>({
    defaultValue: {},
});

const [GroupProvider, useGroupContext] = createContextSuite<
    | (Pick<GroupProps, 'variant' | 'size' | 'disabled'> & {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue: (value: any) => void;
      })
    | undefined
>({ defaultValue: undefined });

export { RadioProvider, GroupProvider, useRadioContext, useGroupContext };
