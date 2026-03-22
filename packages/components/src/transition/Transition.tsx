import { cnMerge, isFunction } from '@nild/shared';
import {
    ReactElement,
    Children,
    useState,
    isValidElement,
    cloneElement,
    useEffect,
    useRef,
    TransitionEvent,
    FC,
} from 'react';
import { mergeHandlers } from '../_shared/utils';
import { TransitionStatus, TransitionProps } from './interfaces';
import variants from './style';

const resolveChild = (children: TransitionProps['children'], status: TransitionStatus) => {
    const resolvedChildren = isFunction(children) ? children(status) : children;

    return Children.toArray(resolvedChildren).find(child => isValidElement(child));
};

/**
 * @category Components
 */
const Transition: FC<TransitionProps> = ({ className, children, visible = true }) => {
    const [status, setStatus] = useState<TransitionStatus>(() => {
        const initialStatus = visible ? TransitionStatus.ENTERED : TransitionStatus.EXITED;

        return resolveChild(children, initialStatus) ? initialStatus : TransitionStatus.UNMOUNTED;
    });
    const child = resolveChild(children, status);
    const targetStatus = child
        ? visible
            ? TransitionStatus.ENTERED
            : TransitionStatus.EXITED
        : TransitionStatus.UNMOUNTED;
    const updateCallbackRef = useRef<{ (): void; cancel(): void }>();
    const cachedChildRef = useRef(child);

    // This ref is completely dependent on the props and state of the component, so its execution is idempotent
    cachedChildRef.current = status === TransitionStatus.UNMOUNTED ? child : (child ?? cachedChildRef.current);

    const cancelUpdateCallback = () => {
        updateCallbackRef.current?.cancel();
        updateCallbackRef.current = undefined;
    };

    const setUpdateCallback = (callback: () => void) => {
        cancelUpdateCallback();
        let active = true;
        const callbackWrapper = () => {
            if (!active) {
                return;
            }

            active = false;
            updateCallbackRef.current = undefined;
            callback();
        };

        callbackWrapper.cancel = () => {
            active = false;
        };
        updateCallbackRef.current = callbackWrapper;
    };

    const scheduleStatus = (nextStatus: TransitionStatus, completedStatus: TransitionStatus) => {
        cancelUpdateCallback();
        setStatus(nextStatus);
        setUpdateCallback(() => {
            setUpdateCallback(() => {
                setStatus(completedStatus);
            });
            if (updateCallbackRef.current) {
                setTimeout(updateCallbackRef.current, 0);
            }
        });
    };

    const handleTransitionEnd = (evt?: TransitionEvent<HTMLElement>) => {
        // ignore bubbling transition events from descendants; only the transition root should advance state.
        if (evt && evt.target !== evt.currentTarget) {
            return;
        }

        if (targetStatus === TransitionStatus.UNMOUNTED && status === TransitionStatus.EXITED) {
            setStatus(TransitionStatus.UNMOUNTED);
        }
    };

    useEffect(() => {
        if (updateCallbackRef.current) {
            updateCallbackRef.current();
            updateCallbackRef.current = undefined;
        }
    }, [status]);

    useEffect(() => {
        if (targetStatus === TransitionStatus.ENTERED) {
            if (status === TransitionStatus.UNMOUNTED) {
                setStatus(TransitionStatus.EXITED);
            } else if (status !== TransitionStatus.ENTERING && status !== TransitionStatus.ENTERED) {
                scheduleStatus(TransitionStatus.ENTERING, TransitionStatus.ENTERED);
            }

            return;
        }

        if (targetStatus === TransitionStatus.EXITED) {
            if (status === TransitionStatus.ENTERING || status === TransitionStatus.ENTERED) {
                scheduleStatus(TransitionStatus.EXITING, TransitionStatus.EXITED);
            }

            return;
        }

        if (status !== TransitionStatus.EXITED && status !== TransitionStatus.UNMOUNTED) {
            scheduleStatus(TransitionStatus.EXITING, TransitionStatus.EXITED);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetStatus, status]);

    if (!cachedChildRef.current) return null;

    const cachedChild = cachedChildRef.current as ReactElement<{
        className?: string;
        onTransitionEnd?: (evt: TransitionEvent<HTMLElement>) => void;
    }>;

    return cloneElement(cachedChild, {
        ...cachedChild.props,
        className: isFunction(children)
            ? cachedChild.props.className
            : cnMerge(cachedChild.props.className, variants.transition({ status }), className),
        onTransitionEnd: mergeHandlers(cachedChild.props.onTransitionEnd, handleTransitionEnd),
    });
};

Transition.displayName = 'Transition';

export default Transition;
