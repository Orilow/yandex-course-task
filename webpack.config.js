// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
    entry: {
        index: './client/index.js',
        hashtagPage: './client/hashtagPage.js',
        config: './config/adventuresPageConfig',
    },
    output: {
        path: path.resolve(__dirname, './dist/client/'),
        filename: '[name].js',
    },
};
