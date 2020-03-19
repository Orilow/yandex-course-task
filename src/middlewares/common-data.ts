import config from 'config';
import { NextFunction as Next, Request, Response } from 'express';

export default (req: Request, _res: Response, next: Next): void => {
    // Хранение в req.locals – рекомендованный способ
    req.locals = {
        meta: {
            charset: 'utf-8',
            description: 'First task',
        },
        title: 'First task',
        staticBasePath: config.get('staticBasePath'),
    };

    next();
};
