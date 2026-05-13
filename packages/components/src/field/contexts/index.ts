import { createContextSuite } from '@nild/shared';
import type { FieldStatus } from '../interfaces';
import type { ReactNode } from 'react';

export interface FieldContextValue {
    status?: FieldStatus;
    issue?: ReactNode;
    required?: boolean;
    disabled?: boolean;
}

const [FieldProvider, useFieldContext] = createContextSuite<FieldContextValue>({
    defaultValue: {},
});

export { FieldProvider, useFieldContext };
