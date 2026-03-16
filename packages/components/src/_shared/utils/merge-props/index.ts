import { cnMerge } from '@nild/shared';
import mergeHandlers from '../merge-handlers';

type PropsRecord = Record<string, unknown>;

const mergeProps = <OriginalProps extends PropsRecord, ExtraProps extends PropsRecord>(
    originalProps: OriginalProps,
    extraProps: ExtraProps,
): OriginalProps & ExtraProps => {
    const mergedProps: PropsRecord = {
        ...originalProps,
        ...extraProps,
    };
    const keys = new Set([...Object.keys(originalProps), ...Object.keys(extraProps)]);

    for (const key of keys) {
        if (key === 'className') {
            const originalClassName = originalProps.className as string | undefined;
            const extraClassName = extraProps.className as string | undefined;

            if (originalClassName || extraClassName) {
                mergedProps.className = cnMerge(extraClassName, originalClassName);
            }

            continue;
        }

        if (key === 'style') {
            const originalStyle = originalProps.style as PropsRecord | undefined;
            const extraStyle = extraProps.style as PropsRecord | undefined;

            if (originalStyle || extraStyle) {
                mergedProps.style = {
                    ...extraStyle,
                    ...originalStyle,
                };
            }

            continue;
        }

        if (/^on[A-Z]/.test(key)) {
            const originalHandler = originalProps[key];
            const extraHandler = extraProps[key];

            if (typeof originalHandler === 'function' || typeof extraHandler === 'function') {
                mergedProps[key] = mergeHandlers(
                    originalHandler as ((...args: unknown[]) => unknown) | undefined,
                    extraHandler as ((...args: unknown[]) => unknown) | undefined,
                );
            }
        }
    }

    return mergedProps as OriginalProps & ExtraProps;
};

export default mergeProps;
