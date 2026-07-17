import { bench, describe } from 'vitest';
import cnJoin from '../index';

describe('cnJoin', () => {
    bench('joins nested conditional class values', () => {
        cnJoin('flex items-center', ['gap-2', false, ['text-sm']], { 'font-medium': true, hidden: false });
    });
});
