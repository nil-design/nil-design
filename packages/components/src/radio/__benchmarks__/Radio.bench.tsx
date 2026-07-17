// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Radio from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Radio', () => {
    bench('mounts and unmounts a radio group', () => {
        mount(
            <Radio.Group defaultValue="first">
                <Radio value="first">First</Radio>
                <Radio value="second">Second</Radio>
                <Radio value="third">Third</Radio>
            </Radio.Group>,
        );
    });
});
