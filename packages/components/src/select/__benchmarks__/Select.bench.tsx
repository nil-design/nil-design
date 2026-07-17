// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Select from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Select', () => {
    bench('mounts and unmounts a select with options', () => {
        mount(
            <Select defaultValue="first">
                <Select.Option label="First" value="first" />
                <Select.Option label="Second" value="second" />
                <Select.Option label="Third" value="third" />
            </Select>,
        );
    });
});
