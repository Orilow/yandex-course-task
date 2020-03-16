'use strict';

const packageMeta = require('../package.json');

// конфиг файлы открыты в учебных целях, иначе они бы были в .gitignore
module.exports = {
    debug: false,
    port: process.env.PORT,
    staticBasePath: `//${packageMeta.name}.surge.sh/`,
    dbHost: 'balarama.db.elephantsql.com',
    dbPort: 5432,
    dbUsername: 'yfnddhje',
    dbPassword: 'ZbRQSYoZbwg6INoJbpWa_6J6i06OjjPa',
    dbDatabase: 'yfnddhje'
};
