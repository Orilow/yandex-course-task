import { Application } from 'express';
import { adventuresList, adventuresListByHashtag, adventuresJSON } from 'controllers/adventures';
import { error404 } from 'controllers/errors';
import { scene } from 'controllers/scenes';

export default (app: Application): void => {
    app.get('/', adventuresList);

    app.get('/scene', scene);

    app.get('/hashtag', adventuresListByHashtag);

    app.get('/load-more-adventures', adventuresJSON);

    app.all('*', error404);
};
