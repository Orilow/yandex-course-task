declare namespace Express {
    interface Request {
        locals: {
            meta?: {
                charset: string;
                description: string;
            };
            title?: string;
            staticBasePath?: string;
        };
    }
}
