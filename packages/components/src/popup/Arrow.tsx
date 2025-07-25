import { FC } from 'react';
import { useArrowContext, usePopupContext } from './contexts';
import { arrowClassNames } from './style';

const Arrow: FC = () => {
    const { arrowed, size, refs } = usePopupContext();
    const { style, orientation } = useArrowContext();

    return arrowed ? <div className={arrowClassNames({ orientation, size })} style={style} ref={refs.arrow} /> : null;
};

Arrow.displayName = 'Popup.Arrow';

export default Arrow;
