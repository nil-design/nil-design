import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

export const getDocsWithMatter = dir => {
    return readdirSync(dir, { withFileTypes: true }).reduce((docs, dirent) => {
        const direntPath = join(dir, dirent.name);
        if (dirent.isDirectory()) {
            docs.push(...getDocsWithMatter(direntPath));
        } else if (dirent.isFile() && dirent.name.endsWith('.md')) {
            const { data, content } = matter.read(direntPath);
            if (data.title) {
                docs.push({ path: direntPath, data, content });
            }
        }

        return docs;
    }, []);
};

export default getDocsWithMatter;
