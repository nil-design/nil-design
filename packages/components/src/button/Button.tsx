import { FC, ReactNode } from 'react';

export interface ButtonProps {
    children?: ReactNode;
}

export const Button: FC<ButtonProps> = ({ children }) => {
    return <button>{children}</button>;
};

export default Button;
