import { Action } from '../models/action';
import { Achievement } from '../models/achievement';
import { Response } from 'express';
import { Scene } from '../models/scene';
import { adventuresList } from './adventures';
import { MyRequest } from '../extensions';

export interface PageData {
    meta?: {
        charset?: string;
        description?: string;
    };
    title?: string;
    staticBasePath?: string;
    id?: number;
}

interface ScenePageData extends PageData {
    scene: Scene;
}

export async function scene(req: MyRequest, res: Response): Promise<void> {
    const id = Number(req.query.id);
    if (!id) {
        return adventuresList(req, res);
    }
    const scene = await Scene.findByPk(id, {
        include: [
            {
                model: Action,
                attributes: ['name', 'nextSceneId'],
            },
            {
                model: Achievement,
                attributes: ['name', 'pictureLink'],
            },
        ],
    });
    if (!scene) {
        return adventuresList(req, res);
    }
    const data: ScenePageData = {
        meta: req.locals?.meta,
        title: req.locals?.title,
        staticBasePath: req.locals?.staticBasePath,
        scene,
    };

    res.render('scene', data);
}
