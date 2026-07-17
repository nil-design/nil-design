// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Checkbox from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Checkbox', () => {
    bench('mounts and unmounts a composed checkbox', () => {
        mount(
            <Checkbox defaultChecked>
                <Checkbox.Indicator>{checked => (checked ? '✓' : '')}</Checkbox.Indicator>
                <Checkbox.Label>Accept terms</Checkbox.Label>
            </Checkbox>,
        );
    });
});
