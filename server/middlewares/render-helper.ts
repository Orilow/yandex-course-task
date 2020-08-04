import nextjs from 'next';
import { NextFunction as Next, Request, Response } from 'express';

export default (nextApp: ReturnType<typeof nextjs>) => (req: Request, res: Response, next: Next): void => {
    req.nextApp = nextApp;
    res.renderPage = (pathname, query): void => {
        nextApp.render(req, res, pathname, query);
    };

    next();
};
