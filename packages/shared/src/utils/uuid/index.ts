const uuid = (
    options: {
        length?: number;
        radix?: number;
        standard?: boolean;
    } = {},
): string => {
    const { length, standard = true } = options;
    let { radix = 16 } = options;

    if (radix < 1 || radix > 36) {
        radix = 16;
    }

    if (standard && !length && radix === 16 && typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    if (standard && !length) {
        const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

        return template.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;

            return v.toString(16);
        });
    }

    const actualLength = length || 32;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz'.substring(0, radix);
    const resultArray = new Array(actualLength);

    for (let i = 0; i < actualLength; i++) {
        resultArray[i] = chars.charAt(Math.floor(Math.random() * radix));
    }

    return resultArray.join('');
};

export default uuid;
