import { useEffectCallback } from '@nild/hooks';
import { cnMerge } from '@nild/shared';
import {
    FC,
    ReactNode,
    ReactElement,
    Children,
    useState,
    isValidElement,
    cloneElement,
    useEffect,
    useRef,
} from 'react';

enum Status {
    UNMOUNTED = 'unmounted',
    ENTERING = 'entering',
    ENTERED = 'entered',
    EXITING = 'exiting',
    EXITED = 'exited',
}

export interface TransitionProps {
    className?: string;
    children?: ReactNode;
    visible?: boolean;
}

/**
 * @category Components
 */
const Transition: FC<TransitionProps> = ({ className, children, visible = true }) => {
    const child = Children.toArray(children).find(child => isValidElement(child));
    const targetStatus = child ? (visible ? Status.ENTERED : Status.EXITED) : Status.UNMOUNTED;
    const [status, setStatus] = useState<Status>(targetStatus);
    const updateCallbackRef = useRef<{ (): void; cancel(): void }>();
    const resolvedChildRef = useRef(child);

    // This ref is completely dependent on the props and state of the component, so its execution is idempotent
    resolvedChildRef.current = status === Status.UNMOUNTED ? child : (child ?? resolvedChildRef.current);

    const setUpdateCallback = useEffectCallback((callback: () => void) => {
        cancelUpdateCallback();

        let active = true;
        const callbackWrapper = () => {
            if (active) {
                active = false;
                updateCallbackRef.current = undefined;
                callback?.();
            }
        };

        callbackWrapper.cancel = () => {
            active = false;
        };
        updateCallbackRef.current = callbackWrapper;
    });

    const executeUpdateCallback = useEffectCallback(() => {
        if (updateCallbackRef.current) {
            updateCallbackRef.current();
            updateCallbackRef.current = undefined;
        }
    });

    const cancelUpdateCallback = useEffectCallback(() => {
        if (updateCallbackRef.current) {
            updateCallbackRef.current.cancel();
            updateCallbackRef.current = undefined;
        }
    });

    const handleTransitionEnd = useEffectCallback(() => {
        if (targetStatus === Status.UNMOUNTED && status === Status.EXITED) {
            setStatus(Status.UNMOUNTED);
        }
    });

    useEffect(() => {
        executeUpdateCallback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    useEffect(() => {
        switch (targetStatus) {
            case Status.ENTERED:
                if (status !== Status.ENTERING && status !== Status.ENTERED) {
                    if (status === Status.UNMOUNTED) {
                        setStatus(Status.EXITED);
                    } else {
                        cancelUpdateCallback();
                        setStatus(Status.ENTERING);
                        setUpdateCallback(() => {
                            setUpdateCallback(() => {
                                setStatus(Status.ENTERED);
                            });
                            if (updateCallbackRef.current) {
                                setTimeout(updateCallbackRef.current, 0);
                            }
                        });
                    }
                }
                break;
            case Status.EXITED:
                if (status === Status.ENTERING || status === Status.ENTERED) {
                    cancelUpdateCallback();
                    setStatus(Status.EXITING);
                    setUpdateCallback(() => {
                        setUpdateCallback(() => {
                            setStatus(Status.EXITED);
                        });
                        if (updateCallbackRef.current) {
                            setTimeout(updateCallbackRef.current, 0);
                        }
                    });
                }
                break;
            case Status.UNMOUNTED:
            default:
                if (status !== Status.EXITED && status !== Status.UNMOUNTED) {
                    cancelUpdateCallback();
                    setStatus(Status.EXITING);
                    setUpdateCallback(() => {
                        setUpdateCallback(() => {
                            setStatus(Status.EXITED);
                        });
                        if (updateCallbackRef.current) {
                            setTimeout(updateCallbackRef.current, 0);
                        }
                    });
                }
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, targetStatus, status]);

    if (!resolvedChildRef.current) return null;

    return cloneElement(resolvedChildRef.current as ReactElement, {
        ...resolvedChildRef.current.props,
        className: cnMerge(
            resolvedChildRef.current.props.className,
            'transition-[opacity,visibility]',
            status === Status.ENTERED ? 'opacity-100 visible' : 'opacity-0 invisible',
            className,
        ),
        onTransitionEnd: handleTransitionEnd,
    });
};

Transition.displayName = 'Transition';

export default Transition;
