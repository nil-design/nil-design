import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactElement, RefAttributes } from 'react';
export { aliasedUtility as renamedUtility } from './re-export';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual style.
     * @defaultValue 'solid'
     */
    variant?: 'solid' | 'ghost';
    disabled?: boolean;
}

export interface GroupProps {
    children?: ReactElement<ButtonProps> | ReactElement<ButtonProps>[];
}

/**
 * Button group.
 * @defaultValue group
 */
export const Group = (props: GroupProps) => {
    return <div>{props.children}</div>;
};

export const Button = Object.assign(
    forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
        return <button ref={ref} disabled={props.disabled} />;
    }),
    {
        Group,
    },
);

/**
 * Keep a previous value.
 */
export function usePrevious<T>(value: T): T | undefined {
    return value;
}

export function sum(left: number, right: number): number {
    return left + right;
}

export const version = '1.0.0';

export enum Direction {
    Up = 'up',
    Down = 'down',
}

export type TupleValue = [name: string, count?: number];

export interface Callable {
    (value: string): number;
    label?: string;
}

export class Store<T> {
    value?: T;

    constructor(value?: T) {
        this.value = value;
    }

    getValue(): T | undefined {
        return this.value;
    }
}

export type ForwardRefLike<P, T> = ((props: P & RefAttributes<T>) => ReactElement | null) & {
    displayName?: string;
};

export function createHookFactory() {
    return 'hook';
}
