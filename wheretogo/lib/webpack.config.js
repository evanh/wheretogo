const path = require('path');

module.exports = {
    context: __dirname + "/src",
    entry: "./index.js",

    output: {
        filename: "index.js",
        path: "../public/javascripts",
    },

    resolve: {
        alias: {
            src: path.join(__dirname, 'src')
        },
        root: [
            path.resolve(__dirname, './src')
        ]
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
        ],
    }
};