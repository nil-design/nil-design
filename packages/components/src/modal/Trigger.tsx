import { useEffectCallback } from '@nild/hooks';
import { mergeRefs } from '@nild/shared';
import { Children, FC, MouseEvent, ReactElement, cloneElement, isValidElement } from 'react';
import { mergeProps } from '../_shared/utils';
import { useModalContext } from './contexts';
import { TriggerProps } from './interfaces';
import variants from './style';

export const isTriggerElement = (child: unknown): child is ReactElement<TriggerProps> => {
    return isValidElement(child) && child.type === Trigger;
};

const Trigger: FC<TriggerProps> = ({ children }) => {
    const { refs, requestOpen } = useModalContext();
    const child = Children.toArray(children).find(child => isValidElement(child));

    const handleClick = useEffectCallback((evt: MouseEvent<Element>) => {
        requestOpen(previousOpen => {
            if (!previousOpen) {
                return true;
            }

            return previousOpen;
        });

        return evt;
    });

    if (!child) {
        return null;
    }

    return cloneElement(
        child as ReactElement,
        mergeProps(child.props, {
            className: variants.trigger(),
            onClick: handleClick,
            ref: mergeRefs(refs.trigger, child.props.ref),
        }),
    );
};

Trigger.displayName = 'Modal.Trigger';

export default Trigger;
