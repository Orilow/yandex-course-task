'use strict';

const dbConfig = require('./database');
const { limit, clientStartPage, serverStartPage } = require('./adventuresPageConfig');

module.exports = {
    debug: true,
    port: 8080,
    staticBasePath: '/',
    DB: {
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
    },
    adventuresPage: { limit, clientStartPage, serverStartPage },
};
