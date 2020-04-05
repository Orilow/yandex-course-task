// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
    entry: './client/client.js',
    output: {
        path: path.resolve(__dirname, './dist/client/'),
        filename: 'bundle.js',
    },
};
