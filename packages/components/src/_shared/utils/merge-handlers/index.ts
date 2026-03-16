type Handler<Args extends unknown[] = unknown[]> = ((...args: Args) => unknown) | undefined;

const isEventLike = (value: unknown): value is { defaultPrevented: boolean } => {
    return typeof value === 'object' && value !== null && 'defaultPrevented' in value;
};

const mergeHandlers = <Args extends unknown[]>(...handlers: Array<Handler<Args>>) => {
    return (...args: Args) => {
        const [firstArg] = args;

        for (const handler of handlers) {
            if (!handler) {
                continue;
            }

            handler(...args);

            if (isEventLike(firstArg) && firstArg.defaultPrevented) {
                break;
            }
        }
    };
};

export default mergeHandlers;
