import config from 'config';
import { NextFunction as Next,  Response } from 'express';
import { MyRequest } from '../extensions';

export default (req: MyRequest, _res: Response, next: Next): void => {
    // Хранение в req.locals – рекомендованный способ
    req.locals = {
        meta: {
            charset: 'utf-8',
            description: 'First task',
            keywords: 'telltail, games, quest, adventure',
            viewport: 'width=device-width, initial-scale=1.0',
            contentLanguage: 'ru-ru',
        },
        title: 'First task',
        staticBasePath: config.get('staticBasePath'),
    };

    next();
};
