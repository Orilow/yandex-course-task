declare namespace Express {
    interface Request {
        locals: {
            meta?: {
                charset: string;
                description: string;
                keywords: string;
                viewport: string;
                contentLanguage: string;
            };
            title?: string;
            staticBasePath?: string;
        };
    }
}
