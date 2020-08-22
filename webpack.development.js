/* eslint-env node */

const { resolve, join } = require('path');
const webpack = require('webpack');

const host = '0.0.0.0';
const port = 1004;

require('dotenv').config();

const sourceFolder = resolve(__dirname, 'src');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: ['react-hot-loader/patch', sourceFolder],
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
    ],
    output: {
        path: resolve('dist'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/',
        sourceMapFilename: '[name].js.map',
        pathinfo: false,
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    devServer: {
        contentBase: join(__dirname, 'dist'),
        publicPath: '/',
        disableHostCheck: true,
        compress: true,
        hot: true,
        http2: true,
        https: true,
        inline: true,
        overlay: true,
        port,
        host,
        historyApiFallback: true,
        after: function () {
            console.log('Ready on "%s" %o', `https://${host}:${port}`);
        },
        stats: 'minimal',
        noInfo: true,
    }
};
