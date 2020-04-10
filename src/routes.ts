import { Application } from 'express';
import { adventuresList, loadAdventuresByHashtag, loadMoreAdventures } from 'controllers/adventures';
import { error404 } from 'controllers/errors';
import { scene } from 'controllers/scenes';

export default (app: Application): void => {
    app.get('/', adventuresList);

    app.get('/scene', scene);

    app.get('/hashtag', loadAdventuresByHashtag);

    app.get('/load-more-adventures', loadMoreAdventures);

    app.all('*', error404);
};
