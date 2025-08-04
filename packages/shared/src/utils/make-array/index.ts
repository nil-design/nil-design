const makeArray = <T>(value: T) => (Array.isArray(value) ? value : [value]) as T extends readonly unknown[] ? T : [T];

export default makeArray;
