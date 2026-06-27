import { FC } from 'react';
import Popup from '../popup';
import { TooltipProps } from './interfaces';

const Tooltip: FC<TooltipProps> = ({ placement = 'top', size = 'small', ...props }) => {
    return <Popup {...props} placement={placement} size={size} inverse action={['hover', 'focus']} />;
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
