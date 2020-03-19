import { Request, Response } from 'express';

import { Adventure } from 'models/adventure';
import { Hashtag } from '../models/hashtag';
import { PageData } from './scenes';

interface AdventuresPageData extends PageData {
    adventures?: Adventure[];
}

interface HashtagPageData extends AdventuresPageData {
    targetHashtag: string;
}

export async function adventuresList(req: Request, res: Response): Promise<void> {
    const { meta, staticBasePath, title } = req.locals;

    const adventures = await Adventure.findAll({
        include: [
            {
                model: Hashtag,
                attributes: ['name', 'ruName'],
            },
        ],
    });
    const data: AdventuresPageData = {
        meta,
        title,
        staticBasePath,
        adventures,
    };

    res.render('index', data);
}

export async function adventuresListByHashtag(req: Request, res: Response): Promise<void> {
    const { meta, staticBasePath, title } = req.locals;
    const taggedAdventures = await Hashtag.findAll({
        where: {
            name: req.query.name,
        },
        include: [
            {
                model: Adventure,
                include: [
                    {
                        model: Hashtag,
                    },
                ],
            },
        ],
    });

    const data: HashtagPageData = {
        meta,
        staticBasePath,
        title,
        targetHashtag: taggedAdventures[0].ruName,
        adventures: taggedAdventures[0].adventures,
    };
    res.render('byHashtag', data);
}
