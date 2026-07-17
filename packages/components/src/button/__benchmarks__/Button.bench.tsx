// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Button from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Button', () => {
    bench('mounts and unmounts 100 buttons', () => {
        mount(Array.from({ length: 100 }, (_, index) => <Button key={index}>Button {index}</Button>));
    });
});
