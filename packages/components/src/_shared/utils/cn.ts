import { ClassValue, clsx } from 'clsx';
import { twMerge, ClassNameValue } from 'tailwind-merge';

const cn = (...classNames: [...ClassValue[], ClassNameValue]) => {
    const lastClassName = classNames.pop();
    return twMerge(clsx(...classNames), lastClassName as ClassNameValue);
};

export default cn;
