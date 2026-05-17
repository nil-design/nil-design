import { ExtractionSession } from './session';
import type { ApiProject, ExtractProjectOptions } from '../interfaces';

export const extractProject = async (options: ExtractProjectOptions): Promise<ApiProject> => {
    return new ExtractionSession(options).extract();
};
