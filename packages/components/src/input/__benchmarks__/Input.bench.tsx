// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Input from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Input', () => {
    bench('mounts and unmounts an input with slots', () => {
        mount(
            <Input defaultValue="benchmark">
                <Input.Prefix>@</Input.Prefix>
                <Input.Suffix>.dev</Input.Suffix>
            </Input>,
        );
    });
});
