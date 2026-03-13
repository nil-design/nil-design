import { describe, expect, it } from 'vitest';
import pascalize from '../index';

describe('pascalize', () => {
    it('should convert kebab-case text to PascalCase', () => {
        expect(pascalize('hello-world')).toBe('HelloWorld');
    });

    it('should normalize mixed text before converting to PascalCase', () => {
        expect(pascalize('hello_world value')).toBe('HelloWorldValue');
    });

    it('should return empty string when input is empty', () => {
        expect(pascalize('')).toBe('');
    });
});
