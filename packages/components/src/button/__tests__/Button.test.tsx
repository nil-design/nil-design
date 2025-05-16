import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import Button from '../Button';

describe('Button', () => {
    it('renders children correctly', () => {
        render(<Button>测试按钮</Button>);
        expect(screen.getByText('测试按钮')).toBeInTheDocument();
    });
});
