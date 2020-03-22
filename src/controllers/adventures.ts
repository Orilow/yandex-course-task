import { Response } from 'express';

import { Adventure } from 'models/adventure';
import { Hashtag } from '../models/hashtag';
import { PageData } from './scenes';
import { ExtendedRequest } from '../extensions';

interface AdventuresPageData extends PageData {
    adventures?: Adventure[];
}

interface HashtagPageData extends AdventuresPageData {
    targetHashtag: string;
}

export async function adventuresList(req: ExtendedRequest, res: Response): Promise<void> {
    const {meta, title, staticBasePath} = req.locals || {};
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
        meta,
        title,
        staticBasePath,
        adventures: filtered,
    };

    res.render('index', data);
}

export async function adventuresListByHashtag(req: ExtendedRequest, res: Response): Promise<void> {
    const {meta, title, staticBasePath} = req.locals || {};
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
        meta,
        title,
        staticBasePath,
        targetHashtag: taggedAdventures[0].ruName,
        adventures: taggedAdventures[0].adventures,
    };
    res.render('byHashtag', data);
}
