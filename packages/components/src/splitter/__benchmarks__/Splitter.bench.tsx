// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Splitter from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Splitter', () => {
    bench('mounts and unmounts a three-panel splitter', () => {
        mount(
            <Splitter defaultSize={[25, 50, 25]}>
                <Splitter.Panel>Left</Splitter.Panel>
                <Splitter.Panel>Center</Splitter.Panel>
                <Splitter.Panel>Right</Splitter.Panel>
            </Splitter>,
        );
    });
});
