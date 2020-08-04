import config from 'config';
import { Request, Response } from 'express';

import Adventure from 'models/adventure';
import { error404 } from './errors';
import Hashtag from 'models/hashtag';
import Op from 'sequelize/lib/operators';
import { PageData } from './scenes';

const ADVENTURES_LIMIT: number = config.get('adventuresPage.limit');
const START_PAGE: number = config.get('adventuresPage.serverStartPage');

const HASHTAGS_CACHE = new Map();

interface AdventuresPageData extends PageData {
    adventures?: Adventure[];
}

interface HashtagPageData extends AdventuresPageData {
    targetHashtag?: string;
}

const DEFAULT_PICTURE_LINK = 'adventure_empty.jpg';

export async function adventuresList(req: Request, res: Response): Promise<void> {
    const { meta, title, staticBasePath } = { meta: undefined, title: undefined, staticBasePath: undefined };
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

    for (const adventure of adventures) {
        if (!adventure.pictureLink || adventure.pictureLink === '') {
            adventure.pictureLink = DEFAULT_PICTURE_LINK;
        }
        if (adventure.hashtags) {
            for (const hashtag of adventure.hashtags) {
                HASHTAGS_CACHE.set(hashtag.name, hashtag.ruName);
            }
        }
    }

    const data: AdventuresPageData = {
        meta,
        title,
        staticBasePath,
        adventures,
    };

    res.render('index', data);
}

export async function adventuresJSON(req: Request, res: Response): Promise<Response> {
    const page: number = req.query.page;
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
        return res.json(additionalAdventures);
    }

    const toSend = {
        staticBasePath: null,
        defaultPictureLink: DEFAULT_PICTURE_LINK,
        adventures: additionalAdventures,
    };
    return res.json(toSend);
}

export async function adventuresListByHashtag(req: Request, res: Response): Promise<void> {
    const { meta, title, staticBasePath } = { meta: undefined, title: undefined, staticBasePath: undefined };
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

export async function adventuresListByHashtagJSON(req: Request, res: Response): Promise<void> {
    const hashtagName = req.query.name;
    const hashtagWithAdventures = await Hashtag.findOne({
        where: {
            name: hashtagName,
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
    if (!hashtagWithAdventures) {
        return error404(req, res);
    }

    const toSend = {
        staticBasePath: null,
        defaultPictureLink: DEFAULT_PICTURE_LINK,
        adventures: hashtagWithAdventures.adventures,
    };
    res.json(toSend);
}
