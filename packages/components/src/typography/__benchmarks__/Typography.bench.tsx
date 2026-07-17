// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Typography from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Typography', () => {
    bench('mounts and unmounts a typography composition', () => {
        mount(
            <Typography>
                <Typography.Title level={2}>Benchmark</Typography.Title>
                <Typography.Paragraph>
                    A <Typography.Text tags={['strong']}>representative</Typography.Text> paragraph.
                </Typography.Paragraph>
                <Typography.Link href="#benchmark">Read more</Typography.Link>
            </Typography>,
        );
    });
});
