import {Application} from 'express';
import {error404} from 'controllers/errors';
import {adventuresList, adventuresListByHashtag} from 'controllers/adventures';
import {scene} from 'controllers/scenes';

export default (app: Application): void => {
    app.get('/', adventuresList);

    app.get('/scene', scene);

    app.get('/hashtag', adventuresListByHashtag);

    app.all('*', error404);
}
