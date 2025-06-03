import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '../../');

const getRootDir = () => {
    return rootDir;
};

export default getRootDir;
