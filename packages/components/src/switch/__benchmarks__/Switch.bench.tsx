// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Switch from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Switch', () => {
    bench('mounts and unmounts a composed switch', () => {
        mount(
            <Switch defaultChecked>
                <Switch.Track type="checked">On</Switch.Track>
                <Switch.Track type="unchecked">Off</Switch.Track>
                <Switch.Thumb>{checked => (checked ? '✓' : '')}</Switch.Thumb>
            </Switch>,
        );
    });
});
