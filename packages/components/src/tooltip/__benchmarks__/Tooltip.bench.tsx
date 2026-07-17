// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Tooltip from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Tooltip', () => {
    bench('mounts and unmounts an open tooltip', () => {
        mount(
            <Tooltip open>
                <Tooltip.Trigger>
                    <button type="button">Trigger</button>
                </Tooltip.Trigger>
                <Tooltip.Portal>Tooltip content</Tooltip.Portal>
            </Tooltip>,
        );
    });
});
