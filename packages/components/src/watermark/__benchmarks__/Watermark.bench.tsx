// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Watermark from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Watermark', () => {
    bench('mounts and unmounts a protected watermark container', () => {
        mount(<Watermark>Document content</Watermark>);
    });
});
