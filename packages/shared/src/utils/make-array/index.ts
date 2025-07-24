const makeArray = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value]);

export default makeArray;
