import isBrowser from '../is-browser';

const getDPR = () => {
    if (!isBrowser()) return 1;

    return window.devicePixelRatio;
};

export default getDPR;
