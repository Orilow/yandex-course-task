import { Request } from 'express';

export type ExtendedRequest = Request & {
    locals?: {
        meta?: {
            charset: string;
            description?: string;
            keywords?: string;
            viewport?: string;
            contentLanguage?: string;
        };
        title?: string;
        staticBasePath?: string;
    };
};
