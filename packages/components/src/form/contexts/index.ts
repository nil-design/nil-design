import { createContextSuite } from '@nild/shared';
import type { FieldStatus } from '../../field';
import type { FormIssueMap } from '../interfaces';
import type { ReactNode } from 'react';

export interface FieldMeta {
    status?: FieldStatus;
    issue?: ReactNode;
}

export interface FormContextValue {
    disabled?: boolean;
    getValue: (name: string) => unknown;
    getMeta: (name: string) => FieldMeta;
    setValue: (name: string, value: unknown) => void;
}

const [FormProvider, useFormContext] = createContextSuite<FormContextValue | undefined>({
    defaultValue: undefined,
});

export const hasIssues = (issues: FormIssueMap | undefined) => {
    if (!issues) {
        return false;
    }

    return Object.keys(issues).some(key => {
        const issue = issues[key];

        if (!issue) {
            return false;
        }

        return Array.isArray(issue) ? issue.length > 0 : true;
    });
};

export { FormProvider, useFormContext };
