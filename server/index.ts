import path from 'path';

import bodyParser from 'body-parser';
import config from 'config';
import morgan from 'morgan';
import nextjs from 'next';
import queryParser from 'express-query-parser';
import express, { NextFunction as Next, Request, Response } from 'express';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

import renderHelper from 'middlewares/render-helper';
import routes from 'routes';

const app = express();

const nextApp = nextjs({ dev: process.env.NODE_ENV !== 'production' });

const publicDir = path.join(__dirname, 'public');
const clientJSDir = path.join(__dirname, '../dist/client');

if (config.get('debug')) {
    app.use(morgan('dev'));
}

//show express static Path
app.use(express.static(publicDir));
app.use(express.static(clientJSDir));

app.use(bodyParser.json());

app.use(renderHelper(nextApp));

routes(app);

app.use((err: Error, _req: Request, res: Response, _next: Next) => {
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

const myConnectionDB = new Sequelize(sequelizeOptions);
myConnectionDB.addModels([__dirname + '/models']);

nextApp
    .prepare()
    .catch(error => console.error(`Error occurred during Next App start: ${error}`))
    .then(() => {
        console.log('Next App successfully started');
        const port = config.get('port');
        app.listen(port, () => {
            console.info(`Server started on ${port}`);
            console.info(`Open http://localhost:${port}/`);
        });
    })
    .catch(error => console.error(`Error occurred during Express server start: ${error}`));
