// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import DatePicker from '..';
import mount from '../../_shared/__benchmarks__/mount';

const date = new Date(2026, 6, 7);

describe('DatePicker', () => {
    bench('mounts and unmounts a date picker', () => {
        mount(<DatePicker defaultValue={date} />);
    });
});
