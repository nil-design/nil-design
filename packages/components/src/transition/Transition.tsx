import { useStableCallback } from '@nild/hooks';
import { cnJoin } from '@nild/shared/utils';
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

interface TransitionProps {
    children?: ReactNode;
    visible?: boolean;
    timeout?: number;
}

const Transition: FC<TransitionProps> = ({ children, visible, timeout = 0 }) => {
    const onlyChild = Children.toArray(children).find(child => isValidElement(child));
    const targetStatus = onlyChild ? (visible ? Status.ENTERED : Status.EXITED) : Status.UNMOUNTED;
    const [status, setStatus] = useState<Status>(targetStatus);
    const updateCallbackRef = useRef<{ (): void; cancel(): void }>();

    const cancelUpdateCallback = useStableCallback(() => {
        if (updateCallbackRef.current) {
            updateCallbackRef.current.cancel();
            updateCallbackRef.current = undefined;
        }
    });

    const setUpdateCallback = useStableCallback((callback: () => void) => {
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

    useEffect(() => {
        if (updateCallbackRef.current) {
            updateCallbackRef.current();
            updateCallbackRef.current = undefined;
        }
    }, [status]);

    useEffect(() => {
        if (targetStatus === Status.ENTERED) {
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
                            setTimeout(updateCallbackRef.current, timeout);
                        }
                    });
                }
            }
        } else {
            if (status === Status.ENTERING || status === Status.ENTERED) {
                cancelUpdateCallback();
                setStatus(Status.EXITING);
                setUpdateCallback(() => {
                    setUpdateCallback(() => {
                        setStatus(Status.EXITED);
                    });
                    if (updateCallbackRef.current) {
                        setTimeout(updateCallbackRef.current, timeout);
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, targetStatus, status]);

    if (!onlyChild) return null;

    return cloneElement(onlyChild as ReactElement, {
        ...onlyChild.props,
        className: cnJoin(onlyChild.props.className, 'transition-[opacity,visibility]'),
        style: {
            ...onlyChild.props.style,
            opacity: status === Status.ENTERED ? 1 : 0,
            visibility: status === Status.ENTERED ? 'visible' : 'hidden',
        },
    });
};

Transition.displayName = 'Transition';

export default Transition;
