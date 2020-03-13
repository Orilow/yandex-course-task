import {Request, Response} from "express";

export const error404 = (_req: Request, res: Response) => {
    res.sendStatus(404);
};
