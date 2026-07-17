import { bench, describe } from 'vitest';
import forwardRefWithGenerics from '../index';

describe('forwardRefWithGenerics', () => {
    bench('creates a generic forward-ref component', () => {
        forwardRefWithGenerics<HTMLButtonElement, { label: string }>((props, ref) => (
            <button ref={ref} type="button">
                {props.label}
            </button>
        ));
    });
});
