// @vitest-environment jsdom
import { bench, describe } from 'vitest';
import Form from '..';
import mount from '../../_shared/__benchmarks__/mount';
import Field from '../../field';
import Input from '../../input';

describe('Form', () => {
    bench('mounts and unmounts a bound form field', () => {
        mount(
            <Form defaultValue={{ email: 'benchmark@example.com' }}>
                <Field name="email">
                    <Field.Label>Email</Field.Label>
                    <Input />
                </Field>
                <Form.Actions>Submit</Form.Actions>
            </Form>,
        );
    });
});
