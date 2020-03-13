'use strict';

const packageMeta = require('../package.json');

module.exports = {
    debug: false,
    port: process.env.PORT,
    staticBasePath: `//${packageMeta.name}.surge.sh/`
};
