// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Segment from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Segment', () => {
    bench('mounts and unmounts a segmented control', () => {
        mount(
            <Segment defaultValue="day">
                <Segment.Item value="day">Day</Segment.Item>
                <Segment.Item value="week">Week</Segment.Item>
                <Segment.Item value="month">Month</Segment.Item>
            </Segment>,
        );
    });
});
