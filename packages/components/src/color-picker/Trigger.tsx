import { FC, ReactNode, isValidElement } from 'react';
import { TriggerProps } from './interfaces';

export const isTriggerElement = (child: ReactNode) => isValidElement(child) && child.type === Trigger;

const Trigger: FC<TriggerProps> = ({ children }) => {
    return children ?? null;
};

Trigger.displayName = 'ColorPicker.Trigger';

export default Trigger;
