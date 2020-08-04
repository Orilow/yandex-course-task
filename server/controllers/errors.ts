import { parse } from 'url';
import { Request, Response } from 'express';

export const error404 = (req: Request, res: Response): void => {
    const parsedUrl = parse(req.url, true);
    const handle = req.nextApp.getRequestHandler();
    handle(req, res, parsedUrl);
};
