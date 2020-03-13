import {Request, Response} from "express";

interface PageData {
    meta?: {
        charset: string;
        description: string;
    };
    title?: string;
    staticBasePath?: string;
}


export function adventuresList(req: Request, res: Response):void  {
    const {meta, staticBasePath, title } = req.locals;
    //здесь возьмем список приключений

    const data: PageData = {
        meta,
        title,
        staticBasePath
    };

    res.render('index', data);
}
