export type ClassValue = ClassArray | ClassDictionary | string | number | bigint | null | boolean | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];

const toStr = (v: NonNullable<ClassValue>): string => {
    let k,
        y,
        str = '';

    if (typeof v === 'string' || typeof v === 'number') {
        return String(v);
    }
    if (typeof v === 'object') {
        if (Array.isArray(v)) {
            for (k = 0; k < v.length; k++) {
                if (v[k]) {
                    y = toStr(v[k]);
                    if (y) {
                        str && (str += ' ');
                        str += y;
                    }
                }
            }
        } else {
            for (k in v) {
                if (v[k]) {
                    str && (str += ' ');
                    str += k;
                }
            }
        }
    }

    return str;
};

const cnJoin = (...args: ClassValue[]): string => {
    let i = 0,
        arg,
        x,
        str = '';

    while (i < args.length) {
        arg = args[i++];
        if (arg) {
            x = toStr(arg);
            if (x) {
                str && (str += ' ');
                str += x;
            }
        }
    }

    return str;
};

export default cnJoin;
