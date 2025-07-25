import { FC } from 'react';
import Popup from '../popup';
import { PopoverProps } from './interfaces';

const Popover: FC<PopoverProps> = props => {
    return <Popup {...props} />;
};

Popover.displayName = 'Popover';

export default Popover;
