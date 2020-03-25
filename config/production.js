'use strict';

const packageMeta = require('../package.json');
const dbConfig = require('./database');

// конфиг файлы открыты в учебных целях, иначе они бы были в .gitignore
module.exports = {
    debug: false,
    port: process.env.PORT,
    staticBasePath: `//${packageMeta.name}.surge.sh/`,
    DB: {
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database
    }
};
