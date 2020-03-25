import { Response } from 'express';
import { ExtendedRequest } from '../extensions';

export const error404 = (_req: ExtendedRequest, res: Response): void => {
    res.sendStatus(404);
};
