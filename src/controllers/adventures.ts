import config from 'config';
import { Response } from 'express';

import { Adventure } from 'models/adventure';
import { Hashtag } from '../models/hashtag';
import { PageData } from './scenes';
import { ExtendedRequest } from '../extensions';
import { error404 } from './errors';
import Op from 'sequelize/lib/operators';

const ADVENTURES_LIMIT: number = config.get('adventuresPage.limit');
const START_PAGE: number = config.get('adventuresPage.serverStartPage');

const HASHTAGS_CACHE = new Map();

interface AdventuresPageData extends PageData {
    adventures?: Adventure[];
}

interface HashtagPageData extends PageData {
    targetHashtag?: string;
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

    for (const adventure of adventures) {
        if (!adventure.pictureLink || adventure.pictureLink === '') {
            adventure.pictureLink = DEFAULT_PICTURE_LINK;
        }
        if (adventure.hastags) {
            for (const hashtag of adventure.hastags) {
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

export async function adventuresJSON(req: ExtendedRequest, res: Response): Promise<Response> {
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
        staticBasePath: req.locals?.staticBasePath,
        defaultPictureLink: DEFAULT_PICTURE_LINK,
        adventures: additionalAdventures,
    };
    return res.json(toSend);
}

export async function loadPageByHashtag(req: ExtendedRequest, res: Response): Promise<void> {
    const { meta, title, staticBasePath } = req.locals || {};
    if (!req.query.name) {
        return adventuresList(req, res);
    }
    const hashtagName = req.query.name;
    const data: HashtagPageData = {
        meta,
        title,
        staticBasePath,
        targetHashtag: undefined,
    };

    if (!HASHTAGS_CACHE.has(hashtagName)) {
        const hashtag = await Hashtag.findOne({
            where: {
                name: hashtagName,
            },
        });

        HASHTAGS_CACHE.set(hashtagName, hashtag.ruName);
    }

    data.targetHashtag = HASHTAGS_CACHE.get(hashtagName);
    res.render('byHashtag', data);
}

export async function adventuresListByHashtag(req: ExtendedRequest, res: Response): Promise<void> {
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
    if (hashtagWithAdventures.length === 0) {
        return error404(req, res);
    }

    const toSend = {
        staticBasePath: req.locals?.staticBasePath,
        defaultPictureLink: DEFAULT_PICTURE_LINK,
        adventures: hashtagWithAdventures.adventures,
    };
    res.json(toSend);
}
