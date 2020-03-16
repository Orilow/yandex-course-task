import {Request, Response} from "express";
import {Scene} from "../models/scene";
import {Action} from "../models/action";
import {Achievement} from "../models/achievement";

export interface PageData {
    meta?: {
        charset: string;
        description: string;
    };
    title?: string;
    staticBasePath?: string;
    id?: number;
}

interface ScenePageData extends PageData{
    scene: Scene;
}

export async function scene(req: Request, res: Response): Promise<void> {
    const {meta, title, staticBasePath} = req.locals;
    const id = Number(req.query.id);
    const scene = await Scene.findByPk(id, {
        include: [
            {
                model: Action,
                attributes: ['name', 'nextSceneId']
            },
            {
                model: Achievement,
                attributes: ['name', 'pictureLink']
            }
        ]
    });
    const data: ScenePageData = {
        meta,
        title,
        staticBasePath,
        scene
    };

    res.render('scene', data);
}
