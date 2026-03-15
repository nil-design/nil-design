import isBrowser from '../is-browser';

const isMobile = () => {
    if (!isBrowser() || typeof navigator === 'undefined') {
        return false;
    }

    const userAgent = navigator.userAgent ?? '';

    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Windows Phone/i.test(userAgent) ||
        (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints ?? 0) > 1) // iPadOS desktop
    ) {
        return true;
    }

    const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
    const noHover = window.matchMedia?.('(hover: none)')?.matches ?? false;
    const narrowViewport = window.matchMedia?.('(max-width: 1024px)')?.matches ?? window.innerWidth <= 1024;

    return coarsePointer && noHover && narrowViewport;
};

export default isMobile;
