import { Application } from 'express';

import { error404 } from 'controllers/errors';
// import { scene } from 'controllers/scenes';
// import {
//     adventuresJSON,
//     adventuresList,
//     adventuresListByHashtag,
//     adventuresListByHashtagJSON,
// } from 'controllers/adventures';

export default (app: Application): void => {
    app.get('/', (req, res) => res.renderPage('/'));

    // app.get('/scene', scene);

    // app.get('/hashtag', adventuresListByHashtag);

    // app.get('/load-more-adventures', adventuresJSON);

    // app.get('/load-hashtag-adventures', adventuresListByHashtagJSON);

    app.all('*', error404);
};
