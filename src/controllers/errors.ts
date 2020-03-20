import { Response } from 'express';
import { MyRequest } from '../extensions';

export const error404 = (_req: MyRequest, res: Response): void => {
    res.sendStatus(404);
};
