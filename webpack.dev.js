const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { join } = require('path');

const host = 'localhost';
const port = 3003;

module.exports = merge(common, {
    devtool: 'inline-source-map',
    entry: {
        app: [
            'babel-polyfill',
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://${host}:${port}`,
            './ui/index.jsx',
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NamedModulesPlugin(),
    ],
    devServer: {
        contentBase: join(__dirname, 'ui', 'assets'),
        publicPath: '/',
        overlay: true,
        compress: true,
        host,
        port,
        hot: true,
        historyApiFallback: true,
        noInfo: true,
    }
});