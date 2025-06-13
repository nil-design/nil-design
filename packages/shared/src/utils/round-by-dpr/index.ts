import getDPR from '../get-dpr';

const roundByDPR = (value: number) => {
    const dpr = getDPR();

    return Math.round(value * dpr) / dpr;
};

export default roundByDPR;
