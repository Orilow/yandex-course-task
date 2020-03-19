import path from 'path';

import config from 'config';
import express, { Request, Response } from 'express';
import hbs from 'hbs';
import helpers from 'handlebars-helpers';
import morgan from 'morgan';
import queryParser from 'express-query-parser';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

import { Achievement } from './models/achievement';
import { Action } from './models/action';
import { Adventure } from './models/adventure';
import { AdventureHashtag } from './models/adventureHashtag';
import commonData from 'middlewares/common-data';
import { Hashtag } from './models/hashtag';
import routes from 'routes';
import { Scene } from './models/scene';

const app = express();

const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');
const publicDir = path.join(__dirname, 'public');

app.set('view engine', 'hbs');
app.set('views', viewsDir);

const comparisonHelper = helpers.comparison();
hbs.registerHelper('eq', comparisonHelper.eq);

if (config.get('debug')) {
    app.use(morgan('dev'));
}

//show express static Path
app.use(express.static(publicDir));

//using middleware
app.use(commonData);

routes(app);

app.use((err: Error, _req: Request, res: Response) => {
    console.error(err.stack);

    res.sendStatus(500);
});

app.use(
    queryParser({
        parseNull: true,
        parseBoolean: true,
    }),
);

const sequelizeOptions: SequelizeOptions = {
    host: config.get('DB.host'),
    port: config.get('DB.port'),
    username: config.get('DB.username'),
    password: config.get('DB.password'),
    database: config.get('DB.database'),
    dialect: 'postgres',
};

const sequelize = new Sequelize(sequelizeOptions);
sequelize.addModels([Adventure, Scene, Action, Achievement, Hashtag, AdventureHashtag]);

sequelize.authenticate().then(
    () => {
        console.info('Connection with Database has been established successfully.');
        hbs.registerPartials(partialsDir, () => {
            const port = config.get('port');
            app.listen(port, () => {
                console.info(`Server started on ${port}`);
                console.info(`Open http://localhost:${port}/`);
            });
        });
    },
    error => console.error('Unable to connect to the database:', error),
);
