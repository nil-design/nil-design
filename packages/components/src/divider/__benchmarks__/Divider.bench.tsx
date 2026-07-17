// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Divider from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Divider', () => {
    bench('mounts and unmounts a labeled divider', () => {
        mount(<Divider>Section</Divider>);
    });
});
