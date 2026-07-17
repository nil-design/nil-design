// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Field from '..';
import mount from '../../_shared/__benchmarks__/mount';
import Input from '../../input';

describe('Field', () => {
    bench('mounts and unmounts a composed field', () => {
        mount(
            <Field required>
                <Field.Label>Email</Field.Label>
                <Input defaultValue="benchmark@example.com" />
                <Field.Helper>Use a work address.</Field.Helper>
                <Field.Status type="success">Looks good.</Field.Status>
            </Field>,
        );
    });
});
