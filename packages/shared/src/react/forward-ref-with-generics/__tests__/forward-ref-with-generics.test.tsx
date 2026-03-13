// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import forwardRefWithGenerics from '../index';

describe('forwardRefWithGenerics', () => {
    it('should forward refs while keeping component props usable', () => {
        const Input = forwardRefWithGenerics<HTMLInputElement, { label: string }>((props, ref) => {
            return <input ref={ref} aria-label={props.label} />;
        });
        const ref = createRef<HTMLInputElement>();

        render(<Input label="username" ref={ref} />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
        expect(screen.getByLabelText('username')).toBe(ref.current);
    });
});
