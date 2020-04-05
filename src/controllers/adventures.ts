import config from 'config';
import { Response } from 'express';

import { Adventure } from 'models/adventure';
import { Hashtag } from '../models/hashtag';
import { PageData } from './scenes';
import { ExtendedRequest } from '../extensions';
import { error404 } from './errors';
import Op = require('sequelize/lib/operators');

const ADVENTURES_LIMIT: number = config.get('adventuresPage.limit');
const START_PAGE: number = config.get('adventuresPage.page');

interface AdventuresPageData extends PageData {
    adventures?: Adventure[];
}

interface HashtagPageData extends AdventuresPageData {
    targetHashtag: string;
}

const DEFAULT_PICTURE_LINK = 'adventure_empty.jpg';

export async function adventuresList(req: ExtendedRequest, res: Response): Promise<void> {
    const { meta, title, staticBasePath } = req.locals || {};
    const adventures = await Adventure.findAll({
        include: [
            {
                model: Hashtag,
                attributes: ['name', 'ruName'],
            },
        ],
        where: {
            firstSceneId: {
                [Op.ne]: null,
            },
        },
        offset: START_PAGE * ADVENTURES_LIMIT,
        limit: ADVENTURES_LIMIT,
    });

    const filtered = adventures.filter(adventure => adventure.firstSceneId != null);

    for (const adventure of filtered) {
        if (!adventure.pictureLink || adventure.pictureLink === '') {
            adventure.pictureLink = DEFAULT_PICTURE_LINK;
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

export async function loadMoreAdventures(req: ExtendedRequest, res: Response): Promise<void> {
    const page: number = req.body.page;
    const additionalAdventures = await Adventure.findAll({
        include: [
            {
                model: Hashtag,
                attributes: ['name', 'ruName'],
            },
        ],
        where: {
            firstSceneId: {
                [Op.ne]: null,
            },
        },
        offset: page * ADVENTURES_LIMIT,
        limit: ADVENTURES_LIMIT,
    });

    if (additionalAdventures.length === 0) {
        res.json(additionalAdventures);
    }

    const toSend = {
        staticBasePath: req.locals?.staticBasePath,
        defaultPictureLink: DEFAULT_PICTURE_LINK,
        adventures: additionalAdventures,
    };
    res.json(toSend);
}

export async function adventuresListByHashtag(req: ExtendedRequest, res: Response): Promise<void> {
    const { meta, title, staticBasePath } = req.locals || {};
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
        return error404(req, res);
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
