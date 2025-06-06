export type ClassValue = ClassArray | ClassDictionary | string | number | bigint | null | boolean | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];

const cnJoin = (...args: ClassValue[]): string => {
    const classNames: string[] = [];

    for (const arg of args) {
        if (!arg) continue;
        if (typeof arg === 'string' || typeof arg === 'number') {
            classNames.push(String(arg));
        } else if (typeof arg === 'object') {
            if (Array.isArray(arg)) {
                const part = cnJoin(...arg);
                part && classNames.push(part);
            } else {
                for (const key in arg) {
                    arg[key] && classNames.push(key);
                }
            }
        }
    }

    return classNames.join(' ');
};

export default cnJoin;
