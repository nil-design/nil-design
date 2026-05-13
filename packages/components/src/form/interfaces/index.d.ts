import type { FormEvent, FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type ValidateTrigger = 'change' | 'submit';
export type FormValue = Record<string, unknown>;
export type FormIssue = ReactNode | { message: ReactNode };
export type FormIssueMap = Record<string, FormIssue | FormIssue[] | undefined>;

export interface FormResolverResult {
    value?: FormValue;
    errors?: FormIssueMap;
    warnings?: FormIssueMap;
}

export type FormResolver = (value: FormValue) => FormResolverResult | Promise<FormResolverResult>;

export interface ActionsProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export interface FormProps
    extends Omit<
        FormHTMLAttributes<HTMLFormElement>,
        'children' | 'defaultValue' | 'onChange' | 'onInvalid' | 'onSubmit'
    > {
    children?: ReactNode;
    defaultValue?: FormValue;
    resolver?: FormResolver;
    validateTrigger?: ValidateTrigger | ValidateTrigger[];
    onChange?: (value: FormValue) => void;
    onInvalid?: (errors: FormIssueMap, value: FormValue, evt: FormEvent<HTMLFormElement>) => void;
    onSubmit?: (value: FormValue, evt: FormEvent<HTMLFormElement>) => void | Promise<void>;
    disabled?: boolean;
}
