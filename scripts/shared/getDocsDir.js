import { resolve } from 'node:path';
import getRootDir from './getRootDir.js';

const docsDir = resolve(getRootDir(), 'docs');

const getDocsDir = () => {
    return docsDir;
};

export default getDocsDir;
