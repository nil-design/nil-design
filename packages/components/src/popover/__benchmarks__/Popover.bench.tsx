// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Popover from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Popover', () => {
    bench('mounts and unmounts an open popover', () => {
        mount(
            <Popover open>
                <Popover.Trigger>
                    <button type="button">Trigger</button>
                </Popover.Trigger>
                <Popover.Portal>Popover content</Popover.Portal>
            </Popover>,
        );
    });
});
