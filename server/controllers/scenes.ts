import Achievement from 'models/achievement';
import Action from 'models/action';
import { adventuresList } from './adventures';
import Scene from 'models/scene';
import { Request, Response } from 'express';

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

export async function scene(req: Request, res: Response): Promise<void> {
    const { meta, title, staticBasePath } = { meta: undefined, title: undefined, staticBasePath: undefined };
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
