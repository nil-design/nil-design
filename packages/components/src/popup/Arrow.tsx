import { FC } from 'react';
import { useArrowContext, usePopupContext } from './contexts';
import { arrowClassNames } from './style';

const Arrow: FC = () => {
    const { size, arrowed, inverse, refs } = usePopupContext();
    const { style, orientation } = useArrowContext();

    return <div className={arrowClassNames({ size, arrowed, inverse, orientation })} style={style} ref={refs.arrow} />;
};

Arrow.displayName = 'Popup.Arrow';

export default Arrow;
