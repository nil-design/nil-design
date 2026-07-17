import { bench, describe } from 'vitest';
import mergeRefs from '../index';

describe('mergeRefs', () => {
    bench('merges callback and object refs', () => {
        const objectRef = { current: null as object | null };
        const mergedRef = mergeRefs<object>(objectRef, () => {});

        mergedRef({});
        mergedRef(null);
    });
});
