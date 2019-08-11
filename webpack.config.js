const path = require('path');

module.exports = {
    entry: './public/javascripts/src/app.js',
    output: {
        path: path.join(__dirname, '/public/dist'),
        filename: 'bundle.js',
        publicPath: './public/dist/',
    },
    mode: 'development',
    devServer: {
        proxy: {
            '/': 'http://localhost:3000'
        }
    }
};