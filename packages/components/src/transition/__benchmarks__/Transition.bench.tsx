// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Transition from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Transition', () => {
    bench('mounts and unmounts a visible transition', () => {
        mount(
            <Transition visible>
                <div>Transition content</div>
            </Transition>,
        );
    });
});
