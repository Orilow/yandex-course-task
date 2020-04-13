const path = require('path');

module.exports = {
    entry: {
        index: './client/index.js',
        config: './config/adventuresPageConfig',
        scene: './client/scene.js',
        hashtagPage: './client/hashtagPage.js',
    },
    output: {
        path: path.resolve(__dirname, './dist/client/'),
        filename: '[name].js',
    },
};
