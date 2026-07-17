// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Slider from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Slider', () => {
    bench('mounts and unmounts a composed slider', () => {
        mount(
            <Slider aria-label="Volume" defaultValue={40}>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumb />
            </Slider>,
        );
    });
});
