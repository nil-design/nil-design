// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import ColorPicker from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('ColorPicker', () => {
    bench('mounts and unmounts a color picker', () => {
        // eslint-disable-next-line @nild/no-hardcoded-colors -- Concrete colors are benchmark input data.
        mount(<ColorPicker defaultValue="blue" presets={['blue', 'green', 'red']} />);
    });
});
