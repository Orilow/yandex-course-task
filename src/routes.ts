import { Application } from 'express';
import { adventuresList, loadPageByHashtag, loadAdventuresByHashtag, loadMoreAdventures } from 'controllers/adventures';
import { error404 } from 'controllers/errors';
import { scene } from 'controllers/scenes';

export default (app: Application): void => {
    app.get('/', adventuresList);

    app.get('/scene', scene);

    app.get('/hashtag', loadPageByHashtag);

    app.get('/load-more-adventures', loadMoreAdventures);

    app.get('/load-hashtag-adventures', loadAdventuresByHashtag);

    app.all('*', error404);
};
