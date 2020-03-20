import { Response } from 'express';

import { Adventure } from 'models/adventure';
import { Hashtag } from '../models/hashtag';
import { PageData } from './scenes';
import { MyRequest } from '../extensions';

interface AdventuresPageData extends PageData {
    adventures?: Adventure[];
}

interface HashtagPageData extends AdventuresPageData {
    targetHashtag: string;
}

export async function adventuresList(req: MyRequest, res: Response): Promise<void> {
    const adventures = await Adventure.findAll({
        include: [
            {
                model: Hashtag,
                attributes: ['name', 'ruName'],
            },
        ],
    });

    const filtered = adventures.filter(adventure => adventure.firstSceneId != null);

    for (const adventure of filtered) {
        if (!adventure.pictureLink || adventure.pictureLink === '') {
            adventure.pictureLink = 'adventure_empty.jpg';
        }
    }

    const data: AdventuresPageData = {
        meta: req.locals?.meta,
        title: req.locals?.title,
        staticBasePath: req.locals?.staticBasePath,
        adventures: filtered,
    };

    res.render('index', data);
}

export async function adventuresListByHashtag(req: MyRequest, res: Response): Promise<void> {
    if (!req.query.name) {
        return adventuresList(req, res);
    }
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

    if (taggedAdventures.length === 0) {
        return adventuresList(req, res);
    }

    const data: HashtagPageData = {
        meta: req.locals?.meta,
        title: req.locals?.title,
        staticBasePath: req.locals?.staticBasePath,
        targetHashtag: taggedAdventures[0].ruName,
        adventures: taggedAdventures[0].adventures,
    };
    res.render('byHashtag', data);
}
