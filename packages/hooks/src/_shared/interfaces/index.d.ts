// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyCallback = (...args: any[]) => any;

export type StableCallback<T extends AnyCallback> = (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
) => ReturnType<T>;
