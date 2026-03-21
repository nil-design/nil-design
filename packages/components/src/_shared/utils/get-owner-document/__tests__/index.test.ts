import { describe, expect, it } from 'vitest';
import getOwnerDocument from '..';

describe('getOwnerDocument', () => {
    it('returns the owner document of the first available node', () => {
        const otherDocument = document.implementation.createHTMLDocument('other');
        const element = otherDocument.createElement('div');

        expect(getOwnerDocument(null, element, document.createElement('div'))).toBe(otherDocument);
    });

    it('falls back to the global document when no node provides one', () => {
        expect(getOwnerDocument(undefined, null)).toBe(document);
    });

    it('supports document fragments', () => {
        const fragment = document.createDocumentFragment();

        expect(getOwnerDocument(fragment)).toBe(document);
    });
});
