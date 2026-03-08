import { FC } from 'react';
import Popup from '../popup';
import { TooltipProps } from './interfaces';

const Tooltip: FC<TooltipProps> = props => {
    return <Popup size="small" placement="top" {...props} inverse borderless action="hover" />;
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
