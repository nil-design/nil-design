type OmitUndefined<T> = {
    [K in keyof T]: Exclude<T[K], undefined>;
};

export default OmitUndefined;
