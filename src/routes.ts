import { Application } from 'express';
import {
    adventuresList,
    adventuresListByHashtag,
    loadAdventuresByHashtag,
    loadMoreAdventures,
} from 'controllers/adventures';
import { error404 } from 'controllers/errors';
import { scene } from 'controllers/scenes';

export default (app: Application): void => {
    app.get('/', adventuresList);

    app.get('/scene', scene);

    app.get('/hashtag', adventuresListByHashtag);

    app.get('/load-more-adventures', loadMoreAdventures);

    app.post('/load-hashtag-adventures', loadAdventuresByHashtag);

    app.all('*', error404);
};
