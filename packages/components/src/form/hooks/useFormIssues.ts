import { isValidElement, useCallback, useRef, useState } from 'react';
import { collectPaths } from '../_shared/path';
import type { FieldMeta } from '../contexts';
import type { FormIssue, FormIssueMap, FormResolver, FormResolverResult, FormValue } from '../interfaces';

const pickFirstIssue = (issue: FormIssue | FormIssue[] | undefined) => {
    return Array.isArray(issue) ? issue[0] : issue;
};

const issueToNode = (issue: FormIssue | FormIssue[] | undefined) => {
    const firstIssue = pickFirstIssue(issue);

    if (!firstIssue) {
        return undefined;
    }

    if (typeof firstIssue === 'object' && !isValidElement(firstIssue) && 'message' in firstIssue) {
        return firstIssue.message;
    }

    return firstIssue;
};

const patchIssue = (issues: FormIssueMap, name: string, issue: FormIssue | FormIssue[] | undefined) => {
    const nextIssue = pickFirstIssue(issue);

    if (!nextIssue) {
        if (!(name in issues)) {
            return issues;
        }

        const nextIssues = { ...issues };

        delete nextIssues[name];

        return nextIssues;
    }

    if (Object.is(pickFirstIssue(issues[name]), nextIssue)) {
        return issues;
    }

    return { ...issues, [name]: nextIssue };
};

const touchField = (state: Record<string, boolean>, name: string) => {
    return state[name] ? state : { ...state, [name]: true };
};

const collectValidated = (
    formValue: FormValue,
    errors: FormIssueMap | undefined,
    warnings: FormIssueMap | undefined,
) => {
    const state: Record<string, boolean> = {};

    collectPaths(formValue).forEach(name => {
        state[name] = true;
    });
    Object.keys(errors ?? {}).forEach(name => {
        state[name] = true;
    });
    Object.keys(warnings ?? {}).forEach(name => {
        state[name] = true;
    });

    return state;
};

interface UseFormIssuesOptions {
    resolver?: FormResolver;
}

export const useFormIssues = ({ resolver }: UseFormIssuesOptions) => {
    const [errors, setErrors] = useState<FormIssueMap>({});
    const [warnings, setWarnings] = useState<FormIssueMap>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [validated, setValidated] = useState<Record<string, boolean>>({});
    const validationSeq = useRef(0);

    const validateValue = useCallback(
        async (formValue: FormValue, name?: string): Promise<FormResolverResult | undefined> => {
            if (!resolver) {
                return { value: formValue, errors: {}, warnings: {} };
            }

            const seq = validationSeq.current + 1;

            validationSeq.current = seq;

            const result = await resolver(formValue);

            if (validationSeq.current !== seq) {
                return undefined;
            }

            if (name) {
                setErrors(current => patchIssue(current, name, result.errors?.[name]));
                setWarnings(current => patchIssue(current, name, result.warnings?.[name]));
                setValidated(current => touchField(current, name));
            } else {
                setErrors(result.errors ?? {});
                setWarnings(result.warnings ?? {});
                setValidated(collectValidated(formValue, result.errors, result.warnings));
            }

            return result;
        },
        [resolver],
    );

    const touch = useCallback((name: string) => {
        setTouched(current => touchField(current, name));
    }, []);

    const touchAll = useCallback((formValue: FormValue, issues: FormIssueMap) => {
        setTouched(collectValidated(formValue, issues, undefined));
    }, []);

    const getMeta = useCallback(
        (name: string): FieldMeta => {
            const error = issueToNode(errors[name]);

            if (error) {
                return { status: 'error', issue: error };
            }

            const warning = issueToNode(warnings[name]);

            if (warning) {
                return { status: 'warning', issue: warning };
            }

            if (resolver && touched[name] && validated[name]) {
                return { status: 'success' };
            }

            return {};
        },
        [errors, resolver, touched, validated, warnings],
    );

    return {
        errors,
        warnings,
        getMeta,
        touch,
        touchAll,
        validateValue,
    };
};
