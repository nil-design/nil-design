import { twMerge } from 'tailwind-merge';
import cnJoin, { ClassValue } from '../cn-join';

const cnMerge = (...classNames: ClassValue[]) => {
    return twMerge(cnJoin(...classNames));
};

export default cnMerge;
