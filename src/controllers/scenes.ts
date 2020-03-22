import { Action } from '../models/action';
import { Achievement } from '../models/achievement';
import { Response } from 'express';
import { Scene } from '../models/scene';
import { adventuresList } from './adventures';
import { ExtendedRequest } from '../extensions';

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

export async function scene(req: ExtendedRequest, res: Response): Promise<void> {
    const {meta, title, staticBasePath} = req.locals || {};
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
        meta,
        title,
        staticBasePath,
        scene,
    };

    res.render('scene', data);
}
