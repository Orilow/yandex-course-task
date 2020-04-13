import { Application } from 'express';
import {
    adventuresList,
    adventuresListByHashtagJSON,
    adventuresJSON,
    adventuresListByHashtag,
} from 'controllers/adventures';
import { error404 } from 'controllers/errors';
import { scene } from 'controllers/scenes';

export default (app: Application): void => {
    app.get('/', adventuresList);

    app.get('/scene', scene);

    app.get('/hashtag', adventuresListByHashtag);

    app.get('/load-more-adventures', adventuresJSON);

    app.get('/load-hashtag-adventures', adventuresListByHashtagJSON);

    app.all('*', error404);
};
