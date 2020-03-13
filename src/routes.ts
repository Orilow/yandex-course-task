import {Application} from 'express';
import {error404} from 'controllers/errors';
import {adventuresList} from 'controllers/adventures';

export default (app: Application): void => {
    app.get('/',  adventuresList);

    app.all('*', error404);
}
