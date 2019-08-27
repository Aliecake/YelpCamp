const path = require('path');
const HtmlWebpackPLugin = require('html-webpack-plugin');


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
            '/': 'http://[::1]:3000'
        }
    },
    module: {
        rules: [
            {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
        ]
        }, {
            test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
            loader: 'url-loader?limit=100000' 
        }
        ],
        
    plugins: [
        new HtmlWebpackPLugin()
    ]
}
};