import { twMerge, ClassNameValue } from 'tailwind-merge';
import cnJoin, { ClassValue } from '../cn-join';

const cnMerge = (...classNames: [...ClassValue[], ClassNameValue]) => {
    const lastClassName = classNames.pop();

    return twMerge(cnJoin(...classNames), lastClassName as ClassNameValue);
};

export default cnMerge;
