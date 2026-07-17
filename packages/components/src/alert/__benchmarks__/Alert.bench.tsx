// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Alert from '..';
import mount from '../../_shared/__benchmarks__/mount';

describe('Alert', () => {
    bench('mounts and unmounts a closable alert', () => {
        mount(
            <Alert closable>
                <Alert.Title>Benchmark alert</Alert.Title>
                Something needs attention.
            </Alert>,
        );
    });
});
